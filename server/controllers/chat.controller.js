const { status } = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { chatService } = require("../services");

const getChats = catchAsync( async (req, res) => {
    const chats = await chatService.getAllUsers(req.params.currentUserId);
    res.status(status.OK).json(chats)
})

const getMessages = catchAsync( async (req, res) => {
    const chatMessages = await chatService.getMessages(req.params.user1, req.params.user2);
    res.status(status.OK).json(chatMessages)
})

module.exports = {
    getChats,
    getMessages
}