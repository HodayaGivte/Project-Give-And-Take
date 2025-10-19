const express = require ('express')
const multer = require('multer')
const data = require('../models/data')
const { admin } = require('../firebase');
require('dotenv').config();// קריאת לקובץ env
const router = express.Router();

const storageMulter = multer.memoryStorage(); // אחסון בזיכרון
const upload = multer({ storage: storageMulter });

//פונקציה להצגת כל החפצים
router.get('/', async (req,res) =>{
    try{
        const products = await data.find({})// מציאת כל החפצים ממסד הנתונים

        return res.status(200).json({ 
         count: products.length,// מספר החפצים במאגר
         data: products,// שדה המחזיק מידע על כל החפצים במאגר
        })   
    } catch(error){
        console.log(error.message)
        res.status(500).send({message: msg.error})
    }
})

// פונקציה להוספת חפץ חדש לאתר
router.post('/', upload.single('avatar'), async (req, res) => {
    try {
      console.log("Received request body:", req.body); // הדפסת גוף הבקשה
      console.log("Received file:", req.file); // הדפסת הקובץ שהתקבל
  
      const { firstName,
         lastName,
         phone, 
         category, 
         objectName, 
         avatar,
         state, 
         location, 
         comments, 
         userId } = req.body;
  
      if (!firstName || !lastName) {
        return res.status(400).send({ message: "First name and last name are required" });
      }
  
      if (!userId) {
        return res.status(400).send({ message: "User ID is required" });
      }
  
      // שמירת התמונה ב-Firebase Storage
      let avatarUrl = null; // ערך ברירת מחדל
      if (req.file) { // בדיקה אם קובץ הועלה
        // יצירת הפניה לשירות האחסון
        const bucket = admin.storage().bucket();
        const fileName = `avatars/${Date.now()}_${req.file.originalname}`; // הגדרת שם קובץ ייחודי
        const file = bucket.file(fileName);
  
        // העלאת הקובץ
        await file.save(req.file.buffer, {
          metadata: { contentType: req.file.mimetype }
        });
  
        // קבלת כתובת התמונה
        avatarUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${fileName}`;
      }
        console.log(avatarUrl)
      const newProduct = new data({
        firstName,
        lastName,
        phone,
        category,
        objectName,
        avatar,
        state,
        location,
        comments,
        userId
      });
  
      const saveProduct = await newProduct.save();
      return res.status(201).send(saveProduct);
    
    } catch (error) {
      console.log("Error saving product:", error.message);
      res.status(500).send({ message: error.message });
    }
  });

  
  //פונקציה להצגת החפצים שהועלו לפי משתמש 
  router.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params; // מקבלים את ה-userId מה-URL
  
      // שליפת החפצים לפי userId
      const products = await data.find({ userId });
      console.log("Products found for user:", products); // הדפסת החפצים שנמצאו
  
      if (products.length === 0) {
        return res.status(404).send({ message: "No products found for user ${userId}" });
      }
  
      return res.status(200).send(products);
  
    } catch (error) {
      console.log("Error fetching products:", error.message); // לוג שגיאה
      res.status(500).send({ message: error.message });
    }
  })
  
  //פונקציה להוספת חפץ המסומן בכוכב לדף המועדפים
  router.post('/saveobject', async (req, res) => {
    const { favoriteIds } = req.body; // קבלת ה-IDs מהבקשה
    try {
      // שליפת פרטי החפצים ממסד הנתונים MongoDB לפי ה-IDs
      const items = await data.find({ _id: { $in: favoriteIds } });
      res.status(200).json({ items }); // שליחת המידע המלא כתגובה
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: 'An error occurred while fetching favorite items.' });
    }
  })
  
//    
  //פונקציה למחיקת חפץ
  router.delete('/:id', async (req, res) => {
    const { id } = req.params; // קבלת מזהה החפץ מה-URL
  
    try {
      // מחיקת החפץ ממסד הנתונים
      const deletedProduct = await data.findByIdAndDelete(id);
  
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' }); // אם לא נמצא החפץ
      }
  
      res.status(200).json({ message: 'Product deleted successfully' }); // תגובה שהחפץ נמחק בהצלחה
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Server error' }); // טיפול בשגיאות
    }
  });
  
  //פונקציה לעריכת חפץ
  router.put('/:id', async (req, res) => {
    const { id } = req.params; // קבלת מזהה החפץ מה-URL
    const { 
      firstName, 
      lastName, 
      phone, 
      category, 
      objectName, 
      state, 
      location, 
      comments, 
      avatar 
    } = req.body; // הנתונים המעודכנים מהטופס
  
    // תוודא שכל השדות החובה קיימים
    if (!firstName || !lastName || !phone || !category || !objectName || !state || !location) {
      return res.status(400).json({ message: 'נא למלא את כל השדות החובה.' });
    }
  
    const updatedData = {
      firstName,
      lastName,
      phone,
      category,
      objectName,
      state,
      location,
      comments,
      avatar
    };
  
    try {
      const updatedProduct = await data.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json(updatedProduct); // החזרת החפץ המעודכן
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // פונקציה להצגת חפץ לפי מזהה ייחודי
  router.get('/product/:productId', async (req, res) => {
    try {
      const { productId } = req.params; // כאן אנחנו משתמשים ב-productId
  
      const product = await data.findById(productId); // שולפים לפי productId
      
      if (!product) {
        return res.status(404).send({ message: `Product with ID ${productId} not found` });
      }
  
      return res.status(200).send(product); // שליחת המוצר כתגובה
    } catch (error) {
      console.log("Error fetching product:", error.message); // לוג שגיאה
      res.status(500).send({ message: error.message });
    }
  });

module.exports = router










  // app.post('/products', async(req,res) =>{
  //   try{
  
  //     console.log("Received data:", req.body); // לוג הבקשה
  
  //     const {firstName, 
  //       lastName,
  //       phone,
  //       category,
  //       objectName,
  //       avatar,
  //       state,
  //       location,
  //       comments,
  //       userId
  //     } = req.body
  
  //     if (!firstName || !lastName) {
  //       return res.status(400).send({ message: "First name and last name are required" });
  //     }
  
  //     if (!userId) {
  //       return res.status(400).send({ message: "User ID is required" });
  //     }
  
  //        //  לבדוק אם השדות לא ריקים
  //     console.log("First Name:", firstName);
  //     console.log("Last Name:", lastName);
  
  //     const newProduct = new data({
  //       firstName, 
  //       lastName,
  //       phone,
  //       category,
  //       objectName,
  //       avatar,
  //       state,
  //       location,
  //       comments,
  //       userId
  //     })
  
  //     const saveProduct = await newProduct.save()
  //     console.log("Saved Product:", saveProduct); // לוג המוצר שנשמר
  
  //     return res.status(201).send(saveProduct)
  
  //     // return res.status(201).send(product)
    
  //   } catch(error){
  //     console.log("Error saving product:", error.message); // לוג שגיאה
  //     res.status(500).send({ message: error.message})
  //   }
  // })


// פונקציה להצגת החפצים השמורים עבור כל משתמש
//   router.get('/saveobject/:userId', async (req, res) => {
//     const { userId } = req.params;
//     console.log('UserId:', userId); // בדיקת קבלת userId
  
//     const authHeader = req.headers.authorization;
  
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(403).send({ message: "User is not authenticated" });
//     }
  
//     const idToken = authHeader.split('Bearer ')[1];
  
//     try {
//         // אימות ה-Token באמצעות Firebase Admin
//         const decodedToken = await admin.auth().verifyIdToken(idToken);
//         const userIdFromToken = decodedToken.uid; // ה-UID של המשתמש מתוך ה-Token
    
//         if (userIdFromToken !== userId) {
//           return res.status(403).send({ message: "User is not authorized" });
//         }
    
//         console.log('UserId:', userId); // בדיקת קבלת userId
      
  
//       // שליפת ה-IDs של החפצים המסומנים מ-Firestore
//       const userDocRef = query(collection(firestore, 'favorites'), where('userId', '==', userId));
//       const snapshot = await getDocs(userDocRef);
  
//       if (snapshot.empty) {
//         return res.status(404).json({ message: 'No favorite items found for this user.' });
//       }
  
//       // איסוף כל ה-IDs של החפצים המסומנים בכוכב
//       const itemIds = [];
//       snapshot.forEach(doc => {
//         itemIds.push(doc.data().itemId);
//       });
  
//       // שליפת פרטי החפצים ממסד הנתונים MongoDB לפי ה-IDs
//       const items = await data.find({ _id: { $in: itemIds } });
  
//       return res.status(200).json({
//         count: items.length, // מספר החפצים השמורים למשתמש זה
//         data: items, // פרטי החפצים השמורים
//       });
//     } catch (error) {
//       console.log(error.message);
//       res.status(500).json({ message: 'An error occurred while fetching favorite items.' });
//     }
//   });
 