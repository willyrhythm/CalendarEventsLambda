const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const eventId = event.pathParameters.eventID;

        const params = {
            TableName: 'CalendarEvents',
            Key: { eventID: eventId }
        };

        const result = await dynamodb.get(params).promise();

        if (!result.Item) {
            return { statusCode: 404, body: JSON.stringify({ message: 'Event not found' }) };
        }

        return { statusCode: 200, body: JSON.stringify(result.Item) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.toString() }) };
    }
};
