const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const queryParam = event.queryStringParameters.search;

        const params = {
            TableName: 'CalendarEvents',
            FilterExpression: 'contains (title, :query)',
            ExpressionAttributeValues: { ':query': queryParam }
        };

        const result = await dynamodb.scan(params).promise();
        return { statusCode: 200, body: JSON.stringify(result.Items) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.toString() }) };
    }
};
