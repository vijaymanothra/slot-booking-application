import { setSlots } from '../services/slotService.js';

export const setSlotsHandler = async (event) => {
    const { start_time: startTime, end_time: endTime, timezone } = event;

    if (!startTime || !endTime || !timezone) {
        return {
            statusCode: 400,
            message: 'Start time, end time, and timezone are required',
        };
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start) || isNaN(end) || start >= end) {
        return {
            statusCode: 400,
            message: 'Invalid start time or end time',
        };
    }

    try {
        // Convert start and end times to UTC
        const startUtc = new Date(start.toLocaleString('en-US', { timeZone: timezone }));
        const endUtc = new Date(end.toLocaleString('en-US', { timeZone: timezone }));

        await setSlots(startUtc, endUtc);
        return {
            statusCode: 200,
            message: 'Slots created successfully',
        };
    } catch (error) {
        return {
            statusCode: 500,
            message: 'Internal Server Error',
        };
    }
};