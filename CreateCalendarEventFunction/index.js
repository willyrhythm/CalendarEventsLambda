const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        // Parse event details from the request
        const eventData = JSON.parse(event.body);

        // Validate required fields
        if (!eventData.title || !eventData.startDateTime || !eventData.endDateTime) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields' })
            };
        }

        // Validate date formats using regex
        const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
        if (!dateRegex.test(eventData.startDateTime) || !dateRegex.test(eventData.endDateTime)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid date format' })
            };
        }

        // Convert date strings to Date objects for comparison
        const startDate = new Date(eventData.startDateTime);
        const endDate = new Date(eventData.endDateTime);

        // Check if endDateTime is after startDateTime and on the same day
        if (endDate <= startDate || endDate.getDate() !== startDate.getDate()) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'endDateTime must be after startDateTime on the same day' })
            };
        }

        // Perform additional input validation as needed

        // Create a new event in DynamoDB if validation passes
        const params = {
            TableName: 'CalendarEvents',
            Item: {
                eventID: uuidv4(),
                title: eventData.title,
                startDateTime: eventData.startDateTime,
                endDateTime: eventData.endDateTime,
                description: eventData.description || ''
            }
        };

        await dynamodb.put(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Event created' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error creating event: ' + error })
        };
    }
};
