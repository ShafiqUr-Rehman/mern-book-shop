import express from "express"
const router=express.Router();
import bcrypt from "bcrypt";
// import { JsonWebTokenError } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { adminModel } from "../model/adminModel.js"

router.get("/ad",async(req,res)=>{
    const ad=await adminModel.find();
    res.send(ad);

})

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const admin = await adminModel.find();
        if (admin.length === 0) {
            bcrypt.genSalt(10, async (err, salt) => {
                if (err) {
                    return res.status(500).json({ error: "Error generating salt" });
                }
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: "Error hashing password" });
                    }
                    try {
                        const newAdmin = await adminModel.create({
                            username,
                            email,
                            password: hash,
                        });
                        res.status(201).json(newAdmin);
                    } catch (creationError) {
                        res.status(500).json({ error: "Error creating admin" });
                    }
                });
            });
        } else {
            res.status(400).json({ message: "Admin already registered" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/count",async(req,res)=>{
    const admins=await adminModel.find();
    res.json({count:admins.length})
  })
export { router as adminRouter }; 
