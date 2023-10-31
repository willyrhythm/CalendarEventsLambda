const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async () => {
    try {
        const params = {
            TableName: 'CalendarEvents'
        };

        const result = await dynamodb.scan(params).promise();
        return { statusCode: 200, body: JSON.stringify(result.Items) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.toString() }) };
    }
};
