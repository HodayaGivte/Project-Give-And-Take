import React , { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {NavbarManue} from "./data"
import { GoArrowUpRight } from "react-icons/go";
import { IoMdStarOutline } from "react-icons/io";
import { LuAmpersand } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { MdMenu } from "react-icons/md";

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState(''); //טקסט החיפוש
  const [suggestions, setSuggestions] = useState([]); // הצעות
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)   
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem('token'); // ניקוי הנתונים 
    setShowLogoutPopup(false); // סגירת הפופאפ
    navigate('/login'); // ניתוב לדף ההתחברות
  };

    // מאזין להקלדה ומבצע חיפוש במאגר
  useEffect(() => {
      const fetchSuggestions = async () => {
        if (searchTerm) {
          try {
            const response = await axios.get('http://localhost:5000/products'); // קבלת כל החפצים
            const itemsArray = response.data.data;
  
            // סינון הצעות כך שיכילו את מחרוזת החיפוש שהוקלדה
            const filteredItems = itemsArray.filter(item =>
              item.objectName.includes(searchTerm) // מכיל את מחרוזת החיפוש
            );
  
            setSuggestions(filteredItems); // עדכון ההצעות
          } catch (error) {
            console.error('שגיאה בטעינת ההצעות:', error);
          }
        } else {
          setSuggestions([]); // ריקון הצעות אם אין טקסט חיפוש
        }
      };

      const handleClickOutside = (event) => {
        if (!event.target.closest('.search-input') && !event.target.closest('.suggestions-list')) {
          setSuggestions([]); // סגירת הצעות אם הלחיצה הייתה מחוץ לשני האלמנטים
        }
      };
    
      // כל פעם שמשתנה ההקלדה, נטען מחדש את ההצעות
      fetchSuggestions();
    
      // מוסיפים מאזין לאירוע של לחיצה מחוץ לתיבת החיפוש וההצעות
      document.addEventListener('click', handleClickOutside);
    
      // מחזירים פונקציה לניקוי (כדי להסיר את המאזין בעת יציאת רכיב כי אין בו שימוש)
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };

  }, [searchTerm]);
  
    // עדכון טקסט החיפוש והצעות החיפוש
  const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
  };
  
    // מעבר לדף תוצאות עם החיפוש הנבחר
  const handleSearch = () => {
      navigate(`/search/${searchTerm}`);
  };
  
    // בחירה בהצעה מתוך הרשימה
  const handleSuggestionClick = (suggestion) => {
      navigate(`/search/${suggestion.objectName}`);
  };

  return (
   <>
     <nav>
       <div className='container flex justify-between items-center  py-1 shadow-lg'>
          {/* logo */}
          <Link to='/Item/homepage' title="מעבר לדף בית">
            <div className='text-l flex ites-center gap-0 font-bold py-1 cursor-pointer'>
              <p>Give</p>
              <LuAmpersand/>
              <p className="text-primary">Take</p>
            </div>
          </Link>

          {/* חיפוש*/}
          <form  onSubmit={handleSearch} className="relative flex items-center ">
            <input
              type="text"
              placeholder="חיפוש"
              value={searchTerm}
              onChange={handleSearchChange} // עדכון שדה הקלט
              className="border w-full rounded-full px-8 py-1 pr-3 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit" onClick={handleSearch}
              className="absolute inset-y-0 left-0 flex items-center pl-3 bg-primary text-white rounded-full px-4 py-2 hover:bg-secondary"
            >
               חפש
            </button>
            {/* הצגת הצעות מתחת לשדה החיפוש */}
            {suggestions.length > 0 && (
              <ul className="absolute top-full text-right w-full mt-2 bg-white shadow-lg
                  rounded-md border border-gray-200 z-50 max-h-60 overflow-y-auto">
                {suggestions.map(suggestion => (
                  <li key={suggestion._id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {suggestion.objectName}
                  </li>
                ))}
              </ul>
            )}          
          </form>


          {/* (שמירה והעלאה)אייקונים */}
          <div className='flex items-center gap-2'>
            {/* דף העלאות */}
            <Link to='../../UploadsPage'>
              <button className='text-xl hover:bg-secondary 
               rounded-full p-2 duration-200'>
                <GoArrowUpRight/>
              </button>
            </Link>

            {/* שמירת חפצים */}
            <Link to='../../SaveObject'>
              <button className='text-xl hover:bg-secondary 
               rounded-full p-2 duration-200'>
                 <IoMdStarOutline/>
              </button>
            </Link> 

            {/* התנתקות */}
            <button onClick={() => setShowLogoutPopup(true)} className='text-xl hover:bg-secondary 
             rounded-full p-2 duration-200'>
               <IoIosLogOut/>
            </button>
           
            {/* תפריט */}
            <div className="relative">
              <button className='md:hidden' onClick={() => setOpen(!open)}>
                <MdMenu className='text-xl'/>
              </button>

              {/* תפריט נפתח */}
              {open && (
        <div className="absolute right-0 mt-2 w-[90vw] bg-secondary shadow-lg rounded-md p-4 z-50 mx-auto">
          <ul className='text-center w-full space-y-4'>
              {NavbarManue.map((item) => {
                return (
                  <li key={item.id} className='text-white cursor-pointer hover:bg-white hover:text-secondary rounded-lg'> 
                    <a href={item.link} className='block py-2 px-4'>
                      {item.title}
                    </a>
                  </li>
                )
              })}
          </ul>
        </div>
      )}
            </div>

            {/* פרסום חפצים  */}
            <Link to='../../Form'>
            <button className='hover:bg-primary
            text-primary font-semibold hover:text-white
            rounded-md border-2 border-primary px-4 py-1
            duration-200 hidden md:block'>
              +פרסום חפצים
            </button>
            </Link>
          </div> 
          
          {/* menu hamburger */}
        </div>
     </nav>
     <nav>
        <div className='container flex justify-center items-center  py-1 shadow-lg'>
          <div className='hidden md:block'> 
            <ul className='flex items-center gap-10 text-gray-600'>
              {NavbarManue.map((item) => {
                return (
                  <li key={item.id}>
                    <a href={item.link} className='inline-block py-1 px-3 hover:text-primary'>
                      {item.title}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </nav>
            {/* פופאפ אישור התנתקות */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-l font-semibold mb-4">האם אתה בטוח שברצונך להתנתק</h2>
            <div className="flex justify-center">
              <button 
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 mr-2"
                onClick={() => setShowLogoutPopup(false)}
              >
                ביטול
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={handleLogout}
              >
                אישור
              </button>
            </div>
          </div>
        </div>
      )}         
    </>
  )
}

export default Navbar

