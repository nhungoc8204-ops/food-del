import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import foodModel from "./models/foodModel.js";

const food_list = [
    // --- Categoy: Salad ---
    { name: "Salad Hy Lạp", image: "food_1.png", price: 1.2, description: "Món salad tươi ngon và tốt cho sức khỏe, cung cấp nhiều vitamin.", category: "Salad" },
    { name: "Salad Thuần Chay", image: "food_2.png", price: 1.8, description: "Salad rau củ quả thuần chay đặc biệt tươi mát.", category: "Salad" },
    { name: "Salad Cỏ Ba Lá", image: "food_3.png", price: 1, description: "Món salad cỏ ba lá bổ dưỡng thanh đạm.", category: "Salad" },
    { name: "Salad Ức Gà", image: "food_4.png", price: 2.4, description: "Salad kết hợp ức gà xé phay bổ sung nhiều protein.", category: "Salad" },
    
    // --- Category: Món cuốn ---
    { name: "Cuộn Rau Củ", image: "food_5.png", price: 1.5, description: "Bánh tráng cuộn rau củ tươi ngon chấm sốt mè.", category: "Món cuốn" },
    { name: "Cuộn Gà Nướng", image: "food_6.png", price: 2, description: "Thịt gà nướng cuộn rau xà lách giòn rụm.", category: "Món cuốn" },
    { name: "Cuộn Gà Xé", image: "food_7.png", price: 1.8, description: "Thịt gà xé cuộn với các loại rau thơm.", category: "Món cuốn" },
    { name: "Cuộn Nấm Chay", image: "food_8.png", price: 1.2, description: "Món cuốn nấm kim châm thanh đạm ăn kèm tương ngọt.", category: "Món cuốn" },

    // --- Category: Tráng miệng ---
    { name: "Kem Gợn Mây", image: "food_9.png", price: 1.2, description: "Kem tươi mát lạnh tan chảy trong miệng.", category: "Tráng miệng" },
    { name: "Kem Trái Cây", image: "food_10.png", price: 2.2, description: "Kem kết hợp các loại trái cây nhiệt đới tươi.", category: "Tráng miệng" },
    { name: "Kem Hũ Vani", image: "food_11.png", price: 1, description: "Kem vani truyền thống thơm béo đựng trong hũ nhỏ.", category: "Tráng miệng" },
    { name: "Kem Vani Cao Cấp", image: "food_12.png", price: 2.4, description: "Kem vani thượng hạng kèm sốt socola.", category: "Tráng miệng" },

    // --- Category: Bánh mì ---
    { name: "Bánh Mì Kẹp Gà", image: "food_13.png", price: 1.5, description: "Bánh mì kẹp thịt gà xé và rau củ tươi.", category: "Bánh mì" },
    { name: "Bánh Mì Chay", image: "food_14.png", price: 1.8, description: "Bánh mì thuần chay với chả nấm và dưa leo.", category: "Bánh mì" },
    { name: "Bánh Mì Nướng Xúc Xích", image: "food_15.png", price: 2, description: "Bánh mì nướng kèm xúc xích và phô mai tan chảy.", category: "Bánh mì" },
    { name: "Bánh Mì Kẹp Kép", image: "food_16.png", price: 2.4, description: "Bánh mì kẹp đầy đặn với 2 lớp nhân đặc biệt.", category: "Bánh mì" },

    // --- Category: Bánh ngọt ---
    { name: "Bánh Cupcake", image: "food_17.png", price: 1.2, description: "Bánh cupcake nướng mềm xốp phủ kem bơ.", category: "Bánh ngọt" },
    { name: "Bánh Kem Thuần Chay", image: "food_18.png", price: 1.5, description: "Bánh kem làm từ nguyên liệu gốc thực vật.", category: "Bánh ngọt" },
    { name: "Bánh Bơ Đường", image: "food_19.png", price: 2, description: "Bánh bông lan nướng bơ đường thơm lừng.", category: "Bánh ngọt" },
    { name: "Bánh Trứng Thái", image: "food_20.png", price: 1.8, description: "Bánh nướng kẹp nhân sữa trứng béo ngậy.", category: "Bánh ngọt" },

    // --- Category: Đồ chay ---
    { name: "Nấm Kho Tỏi", image: "food_21.png", price: 1.5, description: "Nấm đùi gà kho tỏi ớt đậm đà đưa cơm.", category: "Đồ chay" },
    { name: "Cơm Chiên Súp Lơ", image: "food_22.png", price: 2.2, description: "Cơm chiên cùng bông cải xanh và hạt sen.", category: "Đồ chay" },
    { name: "Rau Củ Trộn", image: "food_23.png", price: 1.2, description: "Salad rau củ quả thập cẩm giàu chất xơ.", category: "Đồ chay" },
    { name: "Cơm Chiên Thập Cẩm", image: "food_24.png", price: 2.4, description: "Cơm chiên rau củ và nấm bào ngư bổ dưỡng.", category: "Đồ chay" },

    // --- Category: Món chính ---
    { name: "Mì Ý Phô Mai", image: "food_25.png", price: 2, description: "Mì Ý sợi dài trộn sốt phô mai béo ngậy.", category: "Món chính" },
    { name: "Mì Sốt Cà Chua", image: "food_26.png", price: 1.8, description: "Mì Ý xào sốt cà chua và bò băm truyền thống.", category: "Món chính" },
    { name: "Mì Ý Sốt Kem", image: "food_27.png", price: 1.5, description: "Mì ống xào sốt kem nấm chuẩn vị Âu.", category: "Món chính" },
    { name: "Mì Ý Gà Băm", image: "food_28.png", price: 2.4, description: "Mì Ý xốt gà băm cay nhẹ đặc biệt.", category: "Món chính" },

    // --- Category: Bún / Phở ---
    { name: "Mì Xào Bơ Tỏi", image: "food_29.png", price: 1.2, description: "Mì sợi xào bơ tỏi thơm lừng hấp dẫn.", category: "Bún / Phở" },
    { name: "Bún Rau Củ", image: "food_30.png", price: 1.5, description: "Bún tươi ăn kèm nước dùng rau củ ngọt thanh.", category: "Bún / Phở" },
    { name: "Phở Gà Tần", image: "food_31.png", price: 2, description: "Phở gà nước hầm sâm bổ dưỡng, thơm ngon.", category: "Bún / Phở" },
    { name: "Phở Gà Nấu Nấm", image: "food_32.png", price: 2.4, description: "Phở nước gà kết hợp các loại nấm thượng hạng.", category: "Bún / Phở" }
];

const seedData = async () => {
    try {
        await connectDB();
        
        // Dọn sạch database để tránh trùng lặp
        await foodModel.deleteMany({}); 

        // Nạp mảng dữ liệu 32 món vào
        await foodModel.insertMany(food_list);
        console.log("✅ Đã làm mới toàn bộ 32 món ăn tiếng Việt với giá chuẩn!");
        process.exit();
    } catch (error) {
        console.log("❌ Lỗi:", error);
        process.exit(1);
    }
}

seedData();