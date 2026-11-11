import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    // Lấy token từ headers của request do Frontend gửi lên
    const { token } = req.headers;
    
    // Nếu không có token, từ chối quyền truy cập
    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login Again" });
    }
    
    try {
        // Giải mã token bằng khóa bí mật JWT_SECRET để lấy ID người dùng
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Gắn ID vừa giải mã được vào body để các Controller phía sau sử dụng
        req.body.userId = token_decode.id;
        
        // Cho phép request đi tiếp
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export default authMiddleware;