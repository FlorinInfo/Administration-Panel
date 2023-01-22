import { Schema, model, Types } from 'mongoose';

interface IUser {
    // _id: Types.ObjectId;
    username: string;
    password: string;
    roles:Array<string>;
    active:boolean;
}

const userSchema = new Schema<IUser>({
    // _id:{ type: Schema.Types.ObjectId },
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