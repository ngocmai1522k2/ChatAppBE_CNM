const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// const generateJWTToken = (payload) => {
//     const jwtToken = jwt.sign({ ...payload }, process.env.JWT_SECRET, {
//         expiresIn: "15d",
//     });

//     return jwtToken; // Trả về token đã được tạo
// };

const genneralAccessToken = (payload) => {
    const accessToken = jwt.sign(
        {
            ...payload,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: '30s' },
    );
    return accessToken;
};

const genneralRefreshToken = (payload) => {
    const refreshToken = jwt.sign(
        {
            ...payload,
        },
        process.env.REFRESH_TOKEN,
        { expiresIn: '365h' },
    );
    return refreshToken;
};

const refreshTokenJwtService = (token, res) => { // Thêm tham số res vào refreshTokenJwtService
    return new Promise(async (resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    resolve({
                        status: 'ERR',
                        message: 'The authentication',
                    });
                }

                const { payload } = user;
                const access_token = await genneralAccessToken({
                    id: user.id,
                    isAdmin: user?.isAdmin,
                });
                const refresh_token = await genneralRefreshToken({
                    id: user.id,
                    isAdmin: user?.isAdmin,
                });
                
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    access_token,
                    refresh_token,
                });
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenJwtService,
};
