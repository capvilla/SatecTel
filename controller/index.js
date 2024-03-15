const { handleMessage } = require("./Telegram")

const handler = async (req, method) => {
    const { body } = req;
    if (body) {
        const messageObj = body.message;
        try {
            await handleMessage(messageObj);
        } catch (error) {
            console.error('Error handling message:', error);
            throw error;
        }
    }
    return;
}


module.exports = { handler }