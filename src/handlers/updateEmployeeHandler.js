import { updateEmployee } from '../services/employeeService.js';

export const updateEmployeeHandler = async (event) => {
    const { employee_code: employeeCode, updates } = event;

    if (!employeeCode || !updates || typeof updates !== 'object') {
        return {
            statusCode: 400,
            message: 'Employee code and updates are required',
        };
    }

    try {
        await updateEmployee(employeeCode, updates);
        return {
            statusCode: 200,
            message: 'Employee details updated successfully',
        };
    } catch (error) {
        console.error('Error in updateEmployeeHandler:', error);
        return {
            statusCode: 500,
            message: 'Internal Server Error',
        };
    }
};