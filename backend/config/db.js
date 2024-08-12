import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://ayushraj:33858627@cluster0.0p7smhl.mongodb.net/food-del').then(()=>console.log("DB Connected"))
}