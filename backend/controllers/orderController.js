import { CurrencyCodes } from "validator/lib/isISO4217.js";
import orderModel from "../models/orderModels.js";
import userModel from '../models/userModels.js'
import stripe from "stripe"

// placing user order for frontend
const placeOrder = async(req,res)=>{
    try {
       const newOrder = new orderModel({
            userId : req.body.userId,
            items:req.body.items,
            amount :req.body.amount,
            address : req.body.address
       }) 
       await newOrder.save();
       await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}})

       
    } catch (error) {
        
    }
}

export {placeOrder}
