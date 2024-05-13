const UserService = require('../services/UserServices');
const JwtService = require('../services/JwtService');
const generateTokenAndSetCookie = require('../middleware/generateToken');

const createUser = async (req, res) => {
    try {
        const { name, username, phone, gender, dateOfBirth, password, confirmPassword } = req.body;
        const regEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const regPhone = /^\+84\d{9}$/;
        // Định dạng số điện thoại gồm +84 và 9 chữ số

        if (!name || !username || !phone || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required',
            });
        } else if (!regEmail.test(username)) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is not a valid email',
            });
        } else if (!regPhone.test(phone)) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The phone number is not valid +84xxxxxxxxx',
            });
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input does not match the confirmed password',
            });
        } else if (password.length < 8) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Password must be at least 8 characters long',
            });
        } else if (!/\d/.test(password) || !/[A-Z]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Password must contain at least one number, one uppercase letter, and one special character',
            });
        } else if (dateOfBirth === null || dateOfBirth === undefined) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The date of birth is required',
            });
        } else {
            // Tính toán tuổi từ ngày sinh
            const today = new Date();
            const birthDate = new Date(dateOfBirth);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            // Kiểm tra tuổi
            if (age < 18) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'User must be at least 18 years old',
                });
            }
        }

        // Kiểm tra giới tính và ngày tháng năm sinh có thể được thực hiện ở đây nếu cần thiết

        const response = await UserService.createUser(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};
const uploadAvatar = async (req, res) => {
    console.log('req.file', req.file);
    if (!req?.file) {
        res.status(403).json({
            status: 'false',
            message: 'Please upload a file',
        });
        return;
    }
    console.log('req?.file', req?.file);
    let data = {};

    if (!!req?.file) {
        data = {
            url: req.file.location,
            type: req.file.mimetype,
        };
    }

    try {
        res.send({
            data: data,
            status: true,
        });
    } catch (e) {
        return res.status(403).json({ status: 'ERR', error: e });
    }
};

const loginUser = async (req, res) => {
    try {
        console.log('Req.body', req.body);
        const { username, password } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(username);
        if (!username || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required',
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email',
            });
        }

        const response = await UserService.loginUser(req.body);
        const { refreshToken, ...newReponse } = response;

        generateTokenAndSetCookie(response.userLogin._id.toString(), res);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            samesite: 'strict',
        });
        // generateTokenAndSetCookie(response.data.data._id, res);
        console.log('response id', response.userLogin._id.toString());

        console.log('cookies: ', req.cookies);
        return res.status(200).json(newReponse);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};
const updateUser = async (req, res) => {
    try {
        console.log('req.body', req.body);
        // Kiểm tra và xử lý từng thuộc tính được cung cấp trong req.body

        const userId = req.params.id;

        const response = await UserService.updateUser(userId, req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};
const deleteFriend = async (req, res) => {
    try {
        console.log('req.body', req.body);
        // Kiểm tra và xử lý từng thuộc tính được cung cấp trong req.body

        const userId = req.params.id;

        const response = await UserService.deleteFriend(userId, req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const addFriend = async (req, res) => {
    try {
        console.log('req.body', req.body);
        // Kiểm tra và xử lý từng thuộc tính được cung cấp trong req.body

        const userId = req.params.id;

        const response = await UserService.addFriend(userId, req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required',
            });
        }

        const response = await UserService.deleteUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required',
            });
        }

        const response = await UserService.getDetailsUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const refreshToken = async (req, res) => {
    // console.log('req.cookie', req.cookies);
    try {
        const token = req.cookies.refresh_Token;
        const jwt = req.cookies.jwt;
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required',
            });
        } else if (!jwt) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The jwt is required',
            });
        }

        const response = await JwtService.refreshTokenJwtService(token);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const logoutUser = async (req, res) => {
    console.log('req.cookie', req.cookies);
    try {
        res.cookie('jwt', '', { maxAge: 0 });
        res.clearCookie('refreshToken');

        return res.status(200).json({
            status: 'OK',
            message: 'LOGOUT SUCCESSFULLY',
        });
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const getAllFriend = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required',
            });
        }

        const response = await UserService.getAllFriend(userId);
        console.log(response);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};
const getDetailByPhone = async (req, res) => {
    try {
        const phone = req.params.phone;
        if (!phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required',
            });
        }

        const response = await UserService.getDetailByPhone(phone);
        console.log(response);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};
// them loi moi ket ban
const addInvite = async (req, res) => {
    try {
        // console.log('check', isCheckEmail);
        const userId = req.params.id;
        const data = req.body;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required',
            });
        }

        console.log('userId', userId);
        const response = await UserService.addInvite(userId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};
// bạn đã gửi lời mời cho những ai
const addListFriend = async (req, res) => {
    try {
        // console.log('check', isCheckEmail);
        console.log('req.body', req.body);
        const userId = req.params.id;
        const data = req.body;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required',
            });
        }

        console.log('userId bi gi v', userId);
        const response = await UserService.addListFriend(userId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};
// xóa loi moi ngta gui cho currentUser
const deleteInvite = async (req, res) => {
    try {
        console.log('req.body', req.body);
        // Kiểm tra và xử lý từng thuộc tính được cung cấp trong req.body
        const { phone } = req.body;
        console.log(phone);
        const userId = req.params.id;

        const response = await UserService.deleteInvite(userId, phone);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};
// xóa loi moi tui gui cho ngta

const deleteListaddFriend = async (req, res) => {
    try {
        console.log('req.body', req.body);
        // Kiểm tra và xử lý từng thuộc tính được cung cấp trong req.body
        const { phone } = req.body;
        const userId = req.params.id;

        const response = await UserService.deleteListaddFriend(userId, phone);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

module.exports = {
    createUser,
    addInvite,
    addListFriend,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    addFriend,
    deleteFriend,
    getDetailsUser,
    refreshToken,
    logoutUser,
    uploadAvatar,
    getAllFriend,
    getDetailByPhone,
    deleteInvite,
    deleteListaddFriend,
};
