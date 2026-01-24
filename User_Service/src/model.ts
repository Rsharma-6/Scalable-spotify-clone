import mongoose, {Document, Schema} from 'mongoose';

export interface Iuser extends Document{
    name: string,
    email: string,
    password: string,
    role: string,
    playlist: string[];
}
 
const schema: Schema<Iuser> =new Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type: String,
        default: "user",
    },
    playlist:[
        {
            type: String,
            // required:false, 
        }
    ],
},
{
    timestamps:true,
}
);

export const User=mongoose.model<Iuser>("User", schema);