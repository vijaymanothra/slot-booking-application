import { getEmployeeByCode } from './employeeService.js';
import { snsClient } from '../utils/snsClient.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const OTP_EXPIRY_MINUTES = 5;

export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
};

export const sendOtp = async (mobileNumber) => {
    const otp = generateOtp();

    if (process.env.NODE_ENV === 'local') {
        console.log(`Mock OTP for ${mobileNumber}: ${otp}`);
    } else {
        await snsClient.publish({
            PhoneNumber: mobileNumber,
            Message: `Your OTP for slot booking is ${otp}`,
        }).promise();
    }

    return otp;
};

export const validateOtp = async (employeeCode, otp) => {
    const employee = await getEmployeeByCode(employeeCode);

    if (!employee || !employee.otp || !employee.otp_expiry) {
        return false;
    }

    const isOtpValid = employee.otp === otp;
    const isOtpExpired = new Date() > new Date(employee.otp_expiry);

    return isOtpValid && !isOtpExpired;
};