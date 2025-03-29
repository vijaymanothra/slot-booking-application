import { validateOtp } from '../services/otpService.js';
import { bookSlot, isSlotAvailable, hasEmployeeBookedSlot } from '../services/slotService.js';

export const bookSlotHandler = async (event) => {
    const { employee_code: employeeCode, otp, slot_time: slotTime, timezone } = event;

    if (!employeeCode || !otp || !slotTime || !timezone) {
        return {
            statusCode: 400,
            message: 'Employee code, OTP, slot time, and timezone are required',
        };
    }

    // Convert slot time to UTC
    const utcSlotTime = new Date(new Date(slotTime).toLocaleString('en-US', { timeZone: timezone }));
    const formattedUtcSlotTime = utcSlotTime.toISOString().replace('T', ' ').substring(0, 19); // Format as YYYY-MM-DD HH:mm:ss

    // Validate OTP
    const isValidOtp = await validateOtp(employeeCode, otp);
    if (!isValidOtp) {
        return {
            statusCode: 400,
            message: 'Invalid or expired OTP. Please try again.',
        };
    }

    // Check if the employee has already booked a slot for the day
    const hasAlreadyBooked = await hasEmployeeBookedSlot(employeeCode, formattedUtcSlotTime);
    if (hasAlreadyBooked) {
        return {
            statusCode: 400,
            message: 'You have already booked a slot for the day. Only one slot is allowed per day.',
        };
    }

    // Check if the slot is available
    const isAvailable = await isSlotAvailable(formattedUtcSlotTime);
    if (isAvailable === false) {
        return {
            statusCode: 404,
            message: 'The selected slot does not exist. Please choose a valid slot.',
        };
    }

    if (!isAvailable) {
        return {
            statusCode: 400,
            message: 'The selected slot is already booked. Please choose a different slot.',
        };
    }

    // Book the slot
    await bookSlot(formattedUtcSlotTime, employeeCode);

    return {
        statusCode: 200,
        message: 'Slot booked successfully!',
    };
};