import { Schema, model } from 'mongoose';

interface IUser {
    username: string;
    password: string;
    roles:Array<string>;
    active:boolean;
}

const userSchema = new Schema<IUser>({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    roles:[{
        type:String,
        default:"Employee",
    }],
    active:{
        type:Boolean,
        default:true
    }
});

module.exports = model<IUser>('User', userSchema);