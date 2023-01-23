const User = require("../models/User");
const Note = require("../models/Note");
import { Request, Response } from "express";
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

interface IUser {
    username: string;
    roles:Array<string>;
    active:boolean;
    password?:string;
}

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(
    async(req:Request, res:Response, )=>{
        const users:Array<IUser> = await User.find().select("-password").lean();
        if(!users?.length) return res.status(400).json({message:"No users found"});
        res.json(users);
    }
);

// @desc Create a new user
// @route POST /users
// @access Private
const createUser = asyncHandler(
    async(req:Request, res:Response)=>{
        // let {username:string, password:string, roles:Array<string>} = req.body;
        const {username, password, roles}: {username:string, password:string, roles:Array<string>} = req.body;

        if(!username || !password || !Array.isArray(roles) || !roles.length) {
            return res.status(400).json({message:"All fields are required"});
        }

        const duplicate:unknown = await User.findOne({username}).lean().exec();
        if(duplicate) {
           return res.status(409).json({message: "Duplicate username"});
        }

        const hashedPassword:string = await bcrypt.hash(password,10);
        const userObject = {
            username,
            password:hashedPassword,
            roles
        }
        const user:IUser = await User.create(userObject);
        if(user) {
            res.status(201).json({message:`New user ${username} created`});
        }
        else {
            res.status(400).json({message:'Invalid data user received'});
        }
    }
);

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(
    async(req: Request,res: Response) => {
        const {id, username, roles, active, password } : {id: string, username:string, roles:Array<string>, active:boolean, password:string} = req.body;

        if(!id || !username || !Array.isArray(roles) || !roles?.length || typeof active !== 'boolean') {
            return res.status(400).json({message: "All fields are required"});
        }
        console.log(id);

        const user:any = await User.findById(id).exec();
        if(!user) return res.status(400).json({message: "User not found"});

        const duplicate:any = await User.findOne({username}).lean().exec();
        if(duplicate && duplicate._id.toString() !== id) return res.status(409).json({message: "Username already exists"});
        user.username = username;
        user.roles = roles;
        user.active = active;

        if(password) user.password = await bcrypt.hash(password, 10);
        const updatedUser:IUser = await user.save();
        res.json({message:`User ${updatedUser.username} updated successfully`});
    }
)

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(
    async(req:Request, res:Response) => {
        const {id}: {id:string} = req.body;
        if(!id) return res.status(400).json({message:"UserID is required"});
        const notes = await Note.findOne({user:id}).lean().exec();
        if(notes?.length) {
            return res.status(400).json({message:"User has assigned notes"});
        }
        const user:any = await User.findById(id).exec();
        if(!user) return res.status(400).json({message:"User not found"});

        await User.deleteOne(user);
        const response:string = "User deleted successfully";
        res.json(response);
    }
)
module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}