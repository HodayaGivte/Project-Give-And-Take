const express = require ('express')
const app = express()
const productsRoute = require('./routes/products')
const cors = require('cors')
const connectionString = require('./db/connect');
const mongoose = require('mongoose')
require('dotenv').config();// קריאת לקובץ env

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // בקשות עם קידוד לפענוח יו אר אל
app.use(cors());

//שימוש בנתיבים
app.use('/products', productsRoute)

// בדיקה
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


// ייצוא זמני של ה-app כדי שהבדיקות יעבדו
module.exports = app;

const PORT = process.env.PORT || 5000; // אם אין פורט מסופק, משתמשים ב-5000

// מפעילים את השרת וחיבור DB רק אם זה לא מצב בדיקה
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
    mongoose
      .connect(connectionString)
      .then(() => console.log("connected to database"))
      .catch((err) => console.log("error", err));
  });
}


//const PORT = process.env.PORT || 5000; // אם אין פורט מסופק, משתמשים ב-5000
//const PORT = process.env.PORT;
























