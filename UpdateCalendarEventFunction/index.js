const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const eventId = event.pathParameters.eventID;
        const eventData = JSON.parse(event.body);

        const params = {
            TableName: 'CalendarEvents',
            Key: { eventID: eventId },
            UpdateExpression: 'set title = :title, startDateTime = :start, endDateTime = :end, description = :desc',
            ExpressionAttributeValues: {
                ':title': eventData.title,
                ':start': eventData.startDateTime,
                ':end': eventData.endDateTime,
                ':desc': eventData.description
            },
            ReturnValues: 'UPDATED_NEW'
        };

        await dynamodb.update(params).promise();
        return { statusCode: 200, body: JSON.stringify({ message: 'Event updated' }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.toString() }) };
    }
};
