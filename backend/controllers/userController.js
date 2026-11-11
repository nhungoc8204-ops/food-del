import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Hàm tạo Token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// API Đăng ký người dùng
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // Kiểm tra xem email đã tồn tại chưa
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // Kiểm tra định dạng email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // Kiểm tra độ dài mật khẩu
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // Mã hóa (hash) mật khẩu
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo user mới
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        // Lưu user vào database và tạo token
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// API Đăng nhập
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User Doesn't Exist" })
        }

        // So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const token = createToken(user._id);
        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { loginUser, registerUser }