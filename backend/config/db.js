import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb://nhungoc8204_db_user:matkhau12345@ac-utbnmrw-shard-00-00.4yybdev.mongodb.net:27017,ac-utbnmrw-shard-00-01.4yybdev.mongodb.net:27017,ac-utbnmrw-shard-00-02.4yybdev.mongodb.net:27017/food-del?ssl=true&replicaSet=atlas-e6bd8l-shard-0&authSource=admin&appName=Cluster0')
        .then(() => console.log("DB Connected"));
}