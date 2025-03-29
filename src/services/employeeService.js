import { dynamoDBClient } from '../utils/dynamoDBClient.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const EMPLOYEE_TABLE = process.env.EMPLOYEE_TABLE;

export const getEmployeeByCode = async (employeeCode) => {
    const result = await dynamoDBClient.get({
        TableName: EMPLOYEE_TABLE,
        Key: { employee_code: employeeCode },
    }).promise();

    return result.Item;
};

export const saveOtpForEmployee = async (employeeCode, otp) => {
    const expiryTime = new Date(Date.now() + 5 * 60000).toISOString();

    await dynamoDBClient.update({
        TableName: EMPLOYEE_TABLE,
        Key: { employee_code: employeeCode },
        UpdateExpression: 'SET otp = :otp, otp_expiry = :expiry',
        ExpressionAttributeValues: {
            ':otp': otp,
            ':expiry': expiryTime,
        },
    }).promise();
};

export const updateEmployee = async (employeeCode, updates) => {
    const updateExpressions = [];
    const expressionAttributeValues = {};

    for (const [key, value] of Object.entries(updates)) {
        updateExpressions.push(`${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = value;
    }

    const updateExpression = `SET ${updateExpressions.join(', ')}`;

    await dynamoDBClient.update({
        TableName: EMPLOYEE_TABLE,
        Key: { employee_code: employeeCode },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
    }).promise();
};