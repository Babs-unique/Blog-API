const Users = require('../models/users.models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');




const register = async (req,res) => {
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    try{
        const existingUser = await Users.findOne({email});
        if(existingUser){
            res.status(400);
            throw new Error("User already exists with this email");
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new Users({
            name,
            email,
            password:hashedPassword,
        });


        await newUser.save();

        res.status(201).json({message:"User registered successfully"});

    }catch(error){
        next(error);
    }
}


const login = async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    try{
        const user = await Users.findOne({email});
        if(!user){
            res.status(400);
            throw new Error("No user found with this email");
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(400);
            throw new Error("Invalid credentials");
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
        return res.status(200).json({Message:"Login successful",token});
    }catch(error){
        next(error);
    }
}


module.exports = {
    register,
    login,
}