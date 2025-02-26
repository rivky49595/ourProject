import { Schema, model } from "mongoose";


const productSchema = Schema({
    // _id: String,  //ת.ז. מוצר
    productName: { type: String, required: true }, //שם המוצר
    Description: { type: String, required: true },  //תיאור המוצר
    productCreationDate: {  //תארריך יצור 
        type: Date,  // סוג Date לתאריך
        default: Date.now  // ברירת מחדל - התאריך הנוכחי בעת יצירת המוצר
    },
    imageUrl: String, //ניתוב לתמונה
    price: { type: Number, required: true }, // מחיר
    categories: {  //קטגוריות
        type: [String],  // מערך של Strings
        enum: ['מטבח', 'רהיטים', 'שולחן ואירוח', 'חדר שינה', 'דקורציה', 'חדר רחצה'],  // אופציות שהמשתמש יכול לבחור מהן
        required: true  // שדה חובה
    },
    stock: { type: Number, default: 0 },  // כמות המלאי הזמין (ברירת מחדל 0)
    material: { type: String },  // חומר המוצר (למשל: "זכוכית", "פלסטיק", "עץ")
    dimensions: {  // ממדי המוצר (למשל: גודל צלחת או גובה כוס)
        width: { type: Number, default: 0 },  // רוחב
        height: { type: Number, default: 0 },  // גובה
        depth: { type: Number, default: 0 }  // עומק
    }


})

export const productModel = model("product", productSchema);

