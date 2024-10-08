import { CurrencyCodes } from "validator/lib/isISO4217.js";
import orderModel from "../models/orderModels.js";
import userModel from '../models/userModels.js'
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing user order for frontend
const placeOrder = async(req,res)=>{

    const frontend_url = "http://localhost:5173"

    try {
       const newOrder = new orderModel({
            userId : req.body.userId,
            items:req.body.items,
            amount :req.body.amount,
            address : req.body.address
       }) 
       await newOrder.save();
       await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}})

       const line_items = req.body.items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount:item.price*100*80
        },
         // You might want to adjust this based on your use case
        
      }));
      line_items.push({
            price_data : {
                currency: "inr",
                product_data : {
                    name : "Delivery charge"
                },
                unit_amount : 2*100*80

            },
            quantity: 1
      })
      const session = await stripe.checkout.session.create({
            line_items : line_items,
            mode : "payment",
            success_url : `${frontend_url}/verify?success=true&orderId=${newOrder._Id}`,
            cancel_url : `${frontend_url}/verify?success=false&orderId=${newOrder._Id}`,
      })

      res.json({success:true,session_url:session.url})
       
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

    const verifyOrder = async(req,res)=>{
        const {orderId,success}= req.body;
        try {
          if (success=="true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            res.json({success:true,message : "paid"})
          }
          else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false,message:"Not Paid"})
          }
        } catch (error) {
            console.log(error);
            res.json({success:false,message:"Error"})
            
        }
    }

export {placeOrder,verifyOrder}
