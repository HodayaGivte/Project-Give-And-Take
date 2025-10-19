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

app.listen(5000,() => {
  console.log('Server is running on port 5000...');
  mongoose
    .connect(connectionString)
    .then(() => console.log("connected to database"))
    .catch((err) => console.log("eror", err));
});


























