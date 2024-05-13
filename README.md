Chạy trên cổng 3001.
File .env không push lên được nên mn kéo xuống dưới để copy code tạo file lại nha

## Api

# mongodb+srv://manh20051151:123@zalo.c7tfrem.mongodb.net/?retryWrites=true&w=majority

-   `[POST] /api/user/signup`: signup.
    -   body: {"name": "String",
        "username": "String",
        "phone":"String",
        "password": "String",
        "confirmPassword": "String"}.
    -   result: {status: String, message: String, data: {}}.
-   `[POST] /api/user/login`: login.
    -   body: { username: String,
        password: String }.
    -   result: {status: String, message: String,accessToken: String, refreshToken: String}.
-   `[POST] /api/user/logout`: logout.
    -   result: {status: String, message: String,}.
-   `[PUT] /api/user/updateUser/:id`: update User
    -   body: {data}.
    -   result: {status: String, message: String, data: {}}.
-   `[DELETE] /api/user/deleteUser/:id`: delete User
    -   result: {status: String, message: String}.
-   `[GET] api/user/getAllUser`: get All User
    -   result: {status: String, message: String, data: [{}]}.
-   `[GET] /api/user/getDetails/:id`: get Details User
    -   result: {status: String, message: String, data: {}}.
-   `[POST] api/user/refreshToken`: refresh Token
    -   result: {status: String, message: String, accessToken: String}.

////////////////////////////////////////////

Đoạn source của file .env :
PORT=3001
MONGO_DB=mongodb+srv://manh20051151:123@zalo.c7tfrem.mongodb.net/?retryWrites=true&w=majority
ACCESS_TOKEN=accessToken
REFRESH_TOKEN=refreshToken
