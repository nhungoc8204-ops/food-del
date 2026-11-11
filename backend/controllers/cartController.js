import userModel from "../models/userModel.js";

// Thêm món ăn vào giỏ hàng
const addToCart = async (req, res) => {
    try {
        // Tìm user dựa vào userId (đã được giải mã từ token ở bước authMiddleware)
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        
        // Nếu món này chưa có trong giỏ, gán số lượng là 1. Nếu có rồi thì cộng thêm 1.
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        
        // Cập nhật lại dữ liệu giỏ hàng mới vào database
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Giảm/Xóa món ăn khỏi giỏ hàng
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        
        // Kiểm tra nếu món ăn đang có số lượng > 0 thì mới giảm đi 1
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Removed From Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Lấy toàn bộ dữ liệu giỏ hàng của user đang đăng nhập
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { addToCart, removeFromCart, getCart }