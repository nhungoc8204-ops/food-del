import foodModel from "../models/foodModel.js";
import fs from 'fs';

// Thêm món ăn mới
const addFood = async (req, res) => {
    if (!req.file) {
        console.log("Dữ liệu chữ nhận được:", req.body);
        return res.json({ success: false, message: "Không nhận được file ảnh!" });
    }

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })

    try {
        await food.save();
        res.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// Lấy danh sách tất cả món ăn
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Xóa món ăn
const removeFood = async (req, res) => {
    try {
        // Tìm món ăn trong database bằng ID
        const food = await foodModel.findById(req.body.id);
        
        // Xóa file ảnh vật lý trong thư mục uploads
        fs.unlink(`uploads/${food.image}`, () => {})

        // Xóa thông tin món ăn khỏi database
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { addFood, listFood, removeFood }