import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const isLocal = process.env.NODE_ENV === 'local';

AWS.config.update({
    accessKeyId: isLocal ? 'idf32y' : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: isLocal ? 'qzuols' : process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    ...(isLocal && { endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000' }),
});

export const dynamoDBClient = new AWS.DynamoDB.DocumentClient();