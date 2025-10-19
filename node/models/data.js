const mongoose = require('mongoose')

const objectSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'must provide text'],
        trim: true,
        maxlength: [20, 'first name can not be more than 20 characters'],
    },
    lastName: {
        type: String,
        required: [true, 'must provide text'],
        trim: true,
        maxlength: [20, 'last name can not be more than 20 characters'],
    },
    phone: {
        type: String,
        trim: true,
        maxlength: [10, 'phone number cannot be more than 10 characters'], // מקסימום 10 ספרות
        minlength: [10, 'phone number must be 10 characters'] // מינימום 10 ספרות
    },
    objectName: {
        type: String,
        trim: true,
        maxlength: [20, 'object name can not be more than 20 characters'],
    },
    category: {
        type: String, // או Array של מחרוזות אם יש כמה קטגוריות
        enum:   ['חשמל', 'ריהוט וכלי בית', 'ביגוד ואופנה', 'ספרים ומדיה', 'לחצר ולגינה', 'לתינוק ולילד', 'ספורט','תכשיטים'], // אפשרויות לתיבה הנגללת
    },
    avatar: {
        type: String, // כתובת URL של התמונה
    },
    state: {
        type: String,
        enum: {
            values: ['חדש באריזה', 'משומש', 'דרוש תיקון'],
        }
    },
    location: {
        type: String,
        enum: ['דרום','מרכז','צפון']
    },
    comments: {
        type: String, // שדה לתגובות
        trim: true,
    },
    userId: {
        type: String,
        required: true, // המשתמש חייב להיות מחובר כדי להעלות חפץ
    },
    uploadTime: {
        type: Date,
        default: Date.now // זמן ברירת מחדל יהיה התאריך והשעה הנוכחיים
    },
  },

)
    

module.exports = mongoose.model('data', objectSchema)