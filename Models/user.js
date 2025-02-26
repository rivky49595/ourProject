import { Schema, model } from "mongoose";


const userSchema = Schema({
    _id: String,
    email: { type: String, required: true, unique: true },  
    userName: { type: String, required: true, unique: true },  
    password: { type: String, required: true },
    role: {
         type: String, default: 'USER'
         },
    WebsiteRegistrationDate: { 
        type: Date,  // סוג Date לתאריך
        default: Date.now}  // ברירת מחדל שתשמור את התאריך הנוכחי של יצירת המשתמש
    },
    { versionKey: false });

export const userModel = model("user", userSchema);

