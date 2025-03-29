import { dynamoDBClient } from '../utils/dynamoDBClient.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const SLOT_TABLE = process.env.SLOT_TABLE || 'SlotTable';

export const isSlotAvailable = async (slotTime) => {
    const result = await dynamoDBClient.get({
        TableName: SLOT_TABLE,
        Key: { slot_time: slotTime },
    }).promise();

    if (!result.Item) {
        return false; // Slot does not exist
    }

    return result.Item.status === 'available';
};

export const bookSlot = async (slotTime, employeeCode) => {
    await dynamoDBClient.update({
        TableName: SLOT_TABLE,
        Key: { slot_time: slotTime },
        UpdateExpression: 'SET employee_code = :employeeCode, #status = :status',
        ExpressionAttributeNames: {
            '#status': 'status',
        },
        ExpressionAttributeValues: {
            ':employeeCode': employeeCode,
            ':status': 'booked',
        },
    }).promise();
};

export const setSlots = async (start, end) => {
    const slots = [];
    let current = new Date(start);

    while (current < end) {
        const formattedSlotTime = current.toISOString().replace('T', ' ').substring(0, 19); // UTC format
        slots.push({
            slot_time: formattedSlotTime,
            status: 'available',
        });
        current.setHours(current.getHours() + 1); // Increment by 1 hour
    }

    const putRequests = slots.map((slot) => ({
        PutRequest: {
            Item: slot,
        },
    }));

    const params = {
        RequestItems: {
            [SLOT_TABLE]: putRequests,
        },
    };

    await dynamoDBClient.batchWrite(params).promise();
};

export const hasEmployeeBookedSlot = async (employeeCode, slotTime) => {
    const date = slotTime.split(' ')[0]; // Extract the date part (YYYY-MM-DD)

    const params = {
        TableName: SLOT_TABLE,
        IndexName: 'employee_code-slot_time-index',
        KeyConditionExpression: 'employee_code = :employeeCode AND begins_with(slot_time, :date)',
        ExpressionAttributeValues: {
            ':employeeCode': employeeCode,
            ':date': date,
        },
    };

    const result = await dynamoDBClient.query(params).promise();

    return result.Items && result.Items.length > 0;
};