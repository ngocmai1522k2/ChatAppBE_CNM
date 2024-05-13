const User = require('../models/User');
const bcrypt = require('bcrypt');
const {
    genneralAccessToken,
    genneralRefreshToken,
    generateTokenAndSetCookie,
    generateJWTToken,
} = require('./JwtService');

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, username, phone, gender, dateOfBirth, password, confirmPassword } = newUser;

        try {
            const checkUser = await User.findOne({
                phone: phone,
            });
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    massage: 'User already exists',
                });
            }
            const hash = bcrypt.hashSync(password, 10);
            console.log('hash', hash);
            const createUser = await User.create({
                name,
                username,
                phone,
                gender,
                dateOfBirth,
                password: hash,
                confirmPassword,
            });
            if (createUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createUser,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { username, password } = userLogin;

        try {
            const checkUser = await User.findOne({
                username: username,
            });
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'User is not defined',
                });
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password);
            // console.log('comparePassword', comparePassword);

            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The password is incorrect',
                });
            }
            const accessToken = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });
            const refreshToken = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                accessToken,
                refreshToken,
                userLogin: checkUser,
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            console.log('checkUser', checkUser);

            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    massage: 'User is not defined',
                });
            }
            // Kiểm tra xem trường dữ liệu được truyền vào có phải là mật khẩu không
            if (data.password) {
                // Mã hóa mật khẩu mới nếu có
                data.password = bcrypt.hashSync(data.password, 10);
            }
            const updateUser = await User.findByIdAndUpdate(id, data, { new: true });
            console.log('id update', id);
            console.log('data update', data);
            console.log('updateUserFindByIDAndUpdate', updateUser);
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateUser,
            });
            console.log('updateUser', updateUser);
        } catch (e) {
            reject(e);
        }
    });
};

const deleteFriend = async (id, phoneToDelete) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });

            if (!checkUser) {
                resolve({
                    status: 'ERR',
                    message: 'User is not defined',
                });
            }

            // Tìm vị trí của object trong phoneBooks có phone trùng với phone cần xoá
            const index = checkUser.phoneBooks.findIndex((item) => item.phone === phoneToDelete);

            // Nếu không tìm thấy object nào có phone trùng, trả về lỗi
            if (index === -1) {
                resolve({
                    status: 'ERR',
                    message: 'Friend with this phone number does not exist',
                });
            }

            // Xoá object có phone trùng khỏi phoneBooks
            checkUser.phoneBooks.splice(index, 1);

            // Lưu cập nhật vào cơ sở dữ liệu
            const updatedUser = await checkUser.save();

            resolve({
                status: 'OK',
                message: 'Friend deleted successfully',
                data: updatedUser,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const addFriend = (id, newFriend) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            console.log('new friend', newFriend);

            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    massage: 'User is not defined',
                });
            }

            checkUser.phoneBooks.push(newFriend);

            const updatedUser = await checkUser.save();

            resolve({
                status: 'OK',
                message: 'Friend added successfully',
                data: updatedUser,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            // console.log('checkUser', checkUser);

            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    massage: 'User is not defined',
                });
            }
            await User.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: 'DELETE USER SUCCESS',
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find();
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allUser,
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: id });
            if (user === null) {
                resolve({
                    status: 'ERR',
                    massage: 'User is not defined',
                });
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user,
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailByPhone = (phone) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ phone: phone });
            console.log(user);
            if (user == null) {
                resolve({
                    status: 'ERR',
                    massage: 'User is not defined',
                });
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user,
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};
const getAllFriend = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: id });
            console.log(user);
            if (user == null) {
                resolve({
                    status: 'ERR',
                    massage: 'User is not defined',
                });
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user.phoneBooks,
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};

// add invite
const addInvite = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            console.log('checkUser', checkUser);

            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    massage: 'User is not defined',
                });
            }
            // Tạo một bản sao của mảng invite và thêm dữ liệu mới vào đó
            // const newInviteArray = [...checkUser.invite ];
            // checkUser.invite.push({
            //     id: data.invite.id,
            //     name: data.invite.name,
            //     phone: data.invite.phone
            // })

            checkUser.invite.push(data);
            const updateUser = await checkUser.save();
            console.log('updateUser', updateUser);
            // console.log('access_Token', access_Token);
            // await User.findOneAndUpdate

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateUser,
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};
// ad loi moi cua ban than. xem ban than da gui loi moi cho nhung ai
const addListFriend = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            console.log('checkUser', checkUser);

            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    massage: 'User is not defined',
                });
            }
            // Tạo một bản sao của mảng invite và thêm dữ liệu mới vào đó
            // const newInviteArray = [...checkUser.invite ];
            // checkUser.invite.push({
            //     id: data.invite.id,
            //     name: data.invite.name,
            //     phone: data.invite.phone
            // })

            checkUser.listAddFriend.push(data);
            const updateUser = await checkUser.save();
            console.log('updateUser', updateUser);
            // console.log('access_Token', access_Token);
            // await User.findOneAndUpdate

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateUser,
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};
// delete invite
const deleteInvite = async (id, phoneToDelete) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tìm người dùng trong cơ sở dữ liệu với id tương ứng và cập nhật phoneBooks
            console.log('gi z ta', phoneToDelete);
            const updatedUser = await User.findOneAndUpdate(
                { _id: id },
                { $pull: { invite: { phone: phoneToDelete } } },
                { new: true },
            );

            // Kiểm tra xem người dùng có tồn tại không
            if (!updatedUser) {
                resolve({
                    status: 'ERR',
                    message: 'User is not defined',
                });
                return;
            }

            // Kiểm tra xem số điện thoại đã được xóa thành công hay không
            // if (!updatedUser.invite.some(item => item.phone === phoneToDelete)) {
            //     resolve({
            //         status: 'ERR',
            //         message: 'inivte with this phone number does not exist',
            //     });
            //     return;
            // }

            resolve({
                status: 'OK',
                message: 'inivte deleted successfully',
                data: updatedUser,
            });
        } catch (error) {
            reject(error);
        }
    });
};
// delete listadd
const deleteListaddFriend = async (id, phoneToDelete) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tìm người dùng trong cơ sở dữ liệu với id tương ứng và cập nhật phoneBooks
            const updatedUser = await User.findOneAndUpdate(
                { _id: id },
                { $pull: { listAddFriend: { phone: phoneToDelete } } },
                { new: true },
            );

            // Kiểm tra xem người dùng có tồn tại không
            if (!updatedUser) {
                resolve({
                    status: 'ERR',
                    message: 'User is not defined',
                });
                return;
            }

            // Kiểm tra xem số điện thoại đã được xóa thành công hay không
            // if (!updatedUser.listAddFriend.some(item => item.phone === phoneToDelete)) {
            //     resolve({
            //         status: 'ERR',
            //         message: 'listAddFriend with this phone number does not exist',
            //     });
            //     return;
            // }

            resolve({
                status: 'OK',
                message: 'listAddFriend deleted successfully',
                data: updatedUser,
            });
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    createUser,
    loginUser,
    addInvite,
    addListFriend,
    updateUser,
    deleteUser,
    addFriend,
    getAllUser,
    getDetailsUser,
    getDetailByPhone,
    getAllFriend,
    deleteFriend,
    deleteInvite,
    deleteListaddFriend,
};
