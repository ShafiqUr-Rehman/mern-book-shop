import express from "express"
const router=express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {adminModel} from "../model/adminModel.js"
import cookieParser from "cookie-parser";
import { userModel } from "../model/userModel.js";
import { useNavigate } from "react-router-dom";


import dotenv from 'dotenv';
dotenv.config();





const isadminlogin = async (req, res, next) => {
  const token = req.cookies.name;

  if (!token) {
    return res.status(401).json({ login: false, message: 'No token provided' });
  }

  try {
    let decoded = jwt.verify(token, process.env.JWT_KEY);
    const admin = await adminModel.findOne({ email: decoded.email });
    if (admin) {
      req.email = decoded.email;
      req.role = decoded.roll;
      return next();
    } 
  } catch (err) {
    if (err.name !== 'JsonWebTokenError') {
      return res.status(401).json({ login: false, message: 'Failed to authenticate token', error: err.message });
    }
  }

  try {
    let decoded = jwt.verify(token, process.env.USER_KEY);
    const user = await userModel.findOne({ email: decoded.email });
    if (user) {
      req.email = decoded.email;
      req.role = decoded.roll;
      return next();
    }
  } catch (err) {
    return res.status(401).json({ login: false, message: 'Failed to authenticate token', error: err.message });
  }

  return res.status(401).json({ login: false, message: 'No valid token provided' });
};








router.post("/register",async (req,res)=>{
    try{
        const{username,email,password}=req.body;
        const useremail=await userModel.findOne({email});
        const userusername=await userModel.findOne({username});
        if(useremail)
        {
            res.json({register:false});
        }
         else
        if(userusername)
            {
                res.json({register:false});
            }
            else
            {
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt, async (err, hash)=> {
        
                        const newuser=await userModel.create({
                            username,
                            email,
                            password:hash,
        
                        })
                        var token = jwt.sign({ email:email,roll:"student" },process.env.USER_KEY);
                        res.cookie("name",token);
        
                        res.json({register:true});
                        
                    });
                });
        
            }

 
    }
    catch(err)
    {
        res.send(err);
    }

})



router.get("/logout",(req,res)=>{
    try{
        res.cookie("name","");
        res.json({logout:true})
    }
    catch(err)
    {  
        res.send(err)

    }

})

router.get("/varify",isadminlogin,(req,res)=>{
  try{

     res.json({login:true,roll:req.role});
  }
  catch(err)
  {  
      res.send(err)

  }

})


router.post("/login", async (req, res) => {
  const { email, password, roll } = req.body;

  try {
    if (roll === "Admin") {
      const admin = await adminModel.findOne({ email });

      if (!admin) {
        return res.json({ message: "Email or password is incorrect" });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (isPasswordValid) {
        const token = jwt.sign({ email: admin.email, roll:"admin" }, process.env.JWT_KEY);
        res.cookie("name", token, { httpOnly: true });
        return res.json({ login: true, roll: "admin" });
      } else {
        return res.json({ message: "Email or password is incorrect" });
      }

    } else if (roll === "Student") {
      const user = await userModel.findOne({ email });

      if (!user) {
        return res.json({ message: "Email or password is incorrect" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = jwt.sign({ email: user.email, roll:"student" }, process.env.USER_KEY);
        res.cookie("name", token, { httpOnly: true });
        return res.json({ login: true, roll: "student" });
      } else {
        return res.json({ message: "Email or password is incorrect" });
      }
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get("/count",async(req,res)=>{
  const users=await userModel.find();
  res.json({count:users.length})
})



export { router as userRouter }; 
