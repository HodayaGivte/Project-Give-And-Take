import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useState } from 'react'

//pages
import SignUpForm from './Components/LoginSignup/SignupForm';
import Login from './Components/LoginSignup/Login';
import Navbar from './Components/Navbar/Navbar';
import Filter from './Components/Filter/Filter';
import Form from './Components/Form/Form';
import SaveObject from './Components/SaveObject/SaveObject';
import UploadsPage from './Components/UploadsPage/UploadsPage';
import Search from './Components/Search/Search';

//items
import HomePage from './Components/Navbar/Items/HomePage/HomePage';
import OneObject from './Components/Navbar/Items/oneObject/oneObject';
import Category from './Components/Navbar/Items/Category/Category';


//layouts
import SharedLayout from './Components/Layouts/SharedLayout';




function App() {
  const [formData, setFormData] = useState(null)  // אחסון הנתונים מהטופס
  const [productToEdit, setProductToEdit] = useState(null); // אחסון המוצר לעריכה
  const [isEditing, setIsEditing] = useState(false); // מצב העריכה
  
  const handleFormSubmit = (data) => {
    setFormData(data);  // עדכון המצב עם הנתונים מהטופס
  }

  return (
    
      <BrowserRouter>
       <Routes>
         <Route path='/' element={<SignUpForm/>}></Route>
         <Route path='/login' element={<Login/>}></Route>
         <Route path='/navbar' element={<Navbar/>}></Route>
         <Route path='/filter' element={<Filter/>}></Route>
         <Route path='/oneobject/:productId' element={<OneObject/>}></Route>
         <Route path='/search/:itemName' element={<Search/>}></Route>
         <Route path='/saveobject' element={<SaveObject/>}></Route>
         <Route path='/uploadspage' element={<UploadsPage/>}></Route>


         <Route 
          path='/form' 
          element={
            <Form 
              onSubmitData={handleFormSubmit} 
              productToEdit={productToEdit} 
              setProductToEdit={setProductToEdit} 
              isEditing={isEditing} 
              setIsEditing={setIsEditing} 
            />
          } 
         />
         <Route 
          path='/form/:id' 
          element={
            <Form 
              onSubmitData={handleFormSubmit} 
              productToEdit={productToEdit} 
              setProductToEdit={setProductToEdit} 
              isEditing={isEditing} 
              setIsEditing={setIsEditing} 
            />
          } 
         />


         {/* Navbar */}
         <Route path='/Item' element={<SharedLayout/>}>
            <Route path='homepage' element={<HomePage/>}/>
            <Route path='oneobject/:productId' element={<OneObject/>}></Route>
            <Route path='category/:category' element={<Category/>}/>

         </Route>

       </Routes>
      </BrowserRouter>
      
    
  );
}

export default App;
