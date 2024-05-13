const express = require("express");
const { sendUploadFileOnApp , getMessages, sendMessage,sendUploadFile, sendMessageOnApp, getMessagesOnApp } = require("../contronllers/MessageController.js");
const { protectRoute } = require("../middleware/authMiddleware");

const uploadFileMiddleware = require('../middleware/fileUpload');
const router = express.Router();
//----------Message----------
//[GET] http://localhost:3001/api/messages/:id
router.get('/:id', protectRoute, getMessages);
//[POST] http://localhost:3001/api/messages/send/:id  
router.post('/send/:id', protectRoute, sendMessage);

//----API App------------
//[Post] http://localhost:3001/api/messages/sendMessage/:id
router.post('/sendMessage/:id', sendMessageOnApp);

// [GET] http://localhost:3001/api/messages/getMessages/:id?senderId=
router.get('/getMessages/:id', getMessagesOnApp);

//----------UploadFile----------

//[POST] http://localhost:3001/api/messages/upload/:id
router.post('/upload/:id', protectRoute, uploadFileMiddleware.single('file'), sendUploadFile);

//[POST] http://localhost:3001/api/messages/uploadOnApp/:id
// 
router.post('/uploadOnApp/:id', uploadFileMiddleware.single('file'), sendUploadFileOnApp);

module.exports = router;
