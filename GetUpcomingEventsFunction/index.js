const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async () => {
    try {
        // Define your date range for 'upcoming' criteria
        const today = new Date().toISOString();

        const params = {
            TableName: 'CalendarEvents',
            FilterExpression: 'startDateTime >= :today',
            ExpressionAttributeValues: { ':today': today }
        };

        const result = await dynamodb.scan(params).promise();
        return { statusCode: 200, body: JSON.stringify(result.Items) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.toString() }) };
    }
};
