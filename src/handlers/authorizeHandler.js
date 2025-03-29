import { getEmployeeByCode, saveOtpForEmployee } from '../services/employeeService.js';
import { sendOtp } from '../services/otpService.js';

export const authorizeHandler = async (event) => {
    const employeeCode = event.employee_code;
    
    if (!employeeCode) {
        return {
            statusCode: 400,
            message: 'Employee code is required',
        };
    }

    const employee = await getEmployeeByCode(employeeCode);

    if (!employee) {
        return {
            statusCode: 404,
            message: 'Employee not found',
        };
    }

    const otp = await sendOtp(employee.mobile_number);
    await saveOtpForEmployee(employeeCode, otp);

    return {
        statusCode: 200,
        otp, // For testing purposes only, remove in production
        message: 'OTP sent successfully',
    };
};