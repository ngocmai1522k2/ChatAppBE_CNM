const UserRouter = require('./UserRouter');
const MessageRouter = require('./MessageRouter');
const ConversationRouter = require('./ConversationRouter.js');

const routes = (app) => {
    app.use('/api/user', UserRouter);
    app.use('/api/messages', MessageRouter);
    app.use('/api/conversations', ConversationRouter);
};

module.exports = routes;
