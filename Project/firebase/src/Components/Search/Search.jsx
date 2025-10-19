import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Back from '../Back/Back';
import ToggleFavorite from '../ToggleFavorite/ToggleFavorite';
import { MdOutlineStarBorder, MdOutlineStar} from "react-icons/md";

const Search = () => {
  const { itemName } = useParams(); // קבלת שם החפץ מהנתיב
  const [items, setItems] = useState([]); // לאחסון החפצים
  const [loading, setLoading] = useState(true); // מצב טעינה
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite } = ToggleFavorite();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products'); 
        console.log(response.data); // הוספת הדפסת הנתונים

        // קבלת המערך מתוך המפתח 'data'
        const itemsArray = response.data.data; 

        // חיפוש החפצים עם השם שהוקלד
        const foundItems = itemsArray.filter(item => item.objectName.includes(itemName));
        setItems(foundItems); // עדכון ה-state עם החפצים שנמצאו
      } catch (error) {
        console.error('שגיאה בטעינת החפצים:', error);
        setError('שגיאה בטעינת החפצים'); // עדכון השגיאה
      } finally {
        setLoading(false); // שינוי מצב טעינה לסיים
      }
    };

    fetchItems();
  }, [itemName]);

  if (loading) {
    return <div>טוען...</div>; // הודעת טעינה
  }

  if (error) {
    return <div>{error}</div>; // הודעת שגיאה
  }


  return (
    <>
     <div className="text-2xl font-bold text-center my-4">תוצאת החיפוש</div>
       <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          { items.length === 0 ? (
            <div>
              <p className="text-center my-4 text-lg font-semibold text-gray-500">לא נמצאו חפצים</p>
            </div>
          ) : (
            items.map((item) => ( 
              <li key={item._id} className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                 <Link to={`/Item/oneobject/${item._id}`}>
                  <img 
                      src={item.avatar} 
                      alt={item.objectName} 
                         className="object-cover w-full h-full rounded-lg shadow-lg"
                  />
                 </Link> 
                 <button 
                    className="absolute top-2 right-2 text-xl"
                    onClick={() => toggleFavorite(item._id)}
                    >
                    {favorites[item._id] ? <MdOutlineStar /> : <MdOutlineStarBorder />}
                 </button>
                </div>
                <p className="mt-2 text-lg font-semibold">{item.objectName}</p>
                <p className="text-sm text-gray-600">{item.location}</p>
              </li>
            ))
          )} 
        </ul>

      <Back/> 
    </>
  );
};

export default Search;



