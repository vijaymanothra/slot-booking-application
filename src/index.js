import { authorizeHandler } from './handlers/authorizeHandler.js';
import { bookSlotHandler } from './handlers/bookSlotHandler.js';

export const handler = async (event) => {
    const action = event.action;

    switch (action) {
        case 'authorize':
            return await authorizeHandler(event);
        case 'book_slot':
            return await bookSlotHandler(event);
        default:
            return {
                statusCode: 400,
                message: 'Invalid action',
            };
    }
};