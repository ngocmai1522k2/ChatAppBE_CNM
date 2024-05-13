const express = require('express');
const routes = express.Router();
const userController = require('../contronllers/UserController');
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');
const { authUserMiddlewareNoneToken } = require('../middleware/authMiddleware');
const uploadFileMiddleware = require('../middleware/fileUpload');

//[POST] http://localhost:3001/api/user/signup
routes.post('/signup', userController.createUser);

//[POST] http://localhost:3001/api/user/login
routes.post('/login', userController.loginUser);

//[POST] http://localhost:3001/api/user/logout
routes.post('/logout', userController.logoutUser);

//[PUT] http://localhost:3001/api/user/updateUser/:id
// routes.put('/updateUser/:id', authUserMiddleware, userController.updateUser);
routes.put('/updateUser/:id', userController.updateUser);

//[PUT] http://localhost:3001/api/user/addFriend/:id
// chỉ cần object {"name":"thai", "phone":"+84703328743"}
routes.put('/addFriend/:id', userController.addFriend);
// thêm lời mời kết bạn
// [PUT] http://localhost:3001/api/user/addInvite/:id
routes.put('/addInvite/:id', userController.addInvite);

// thêm lời mời kết bạn vào ban than
// [PUT] http://localhost:3001/api/user/addListFriend/:id
routes.put('/addListFriend/:id', userController.addListFriend);
//[DELETE] http://localhost:3001/api/user/deleteUser/:id
routes.delete('/deleteUser/:id', authMiddleware, userController.deleteUser);

//[GET] http://localhost:3001/api/user/getAllUser
// routes.get('/getAllUser', authMiddleware, userController.getAllUser);

//[GET] http://localhost:3001/api/user/getAllUser
routes.get('/getAllUser', userController.getAllUser);

//[GET] http://localhost:3001/api/user/getDetails/:id
routes.get('/getDetails/:id', userController.getDetailsUser);

//localhost:3001/api/user/refreshToken
routes.post('/refreshToken', userController.refreshToken);

//localhost:3001/api/user/uploadAvatar
routes.post('/uploadAvatar', uploadFileMiddleware.single('file'), userController.uploadAvatar);

//[GET] http://localhost:3001/api/user/getAllFriend/:id
routes.get('/getAllFriend/:id', userController.getAllFriend);

//[GET] http://localhost:3001/api/user/getDetailsByPhone/:phone
routes.get('/getDetailsByPhone/:phone', userController.getDetailByPhone);

//[POST] http://localhost:3001/api/user/deleteFriend/:id
routes.post('/deleteFriend/:id', userController.deleteFriend);

// xóa invite , xóa lời mời kết bạn người ta gửi cho mình
//[POST] http://localhost:3001/api/user/deleteInvite/:id
routes.post('/deleteInvite/:id', userController.deleteInvite);

// xóa listaddFriend , xóa lời mời kết bạn mình gửi cho ngta
//[POST] http://localhost:3001/api/user/deleteInvite/:id
routes.post('/deleteListaddFriend/:id', userController.deleteListaddFriend);

module.exports = routes;
