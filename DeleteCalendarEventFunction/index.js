const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const eventId = event.pathParameters.eventID;

        const params = {
            TableName: 'CalendarEvents',
            Key: { eventID: eventId }
        };

        await dynamodb.delete(params).promise();
        return { statusCode: 200, body: JSON.stringify({ message: 'Event deleted' }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.toString() }) };
    }
};
