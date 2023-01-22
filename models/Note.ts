import { Schema, model, Types } from 'mongoose';
const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

interface INote {
    user:Types.ObjectId,
    title:string,
    text:string,
    completed:boolean
}

const noteSchema = new Schema<INote>({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    completed: {
        type: Boolean,
        default: false,
    }
},{
    timestamps:true
});

noteSchema.plugin(AutoIncrement,{
    inc_field:'ticket',
    id: 'ticketNums',
    start_seq:100
})

module.exports = model<INote>('Note', noteSchema);