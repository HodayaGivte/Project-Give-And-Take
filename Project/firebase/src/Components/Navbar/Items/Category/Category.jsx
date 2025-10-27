import React, { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import axios from 'axios'
import { MdOutlineStarBorder, MdOutlineStar} from "react-icons/md";
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc} from "firebase/firestore";
import { auth } from '../../../LoginSignup/firebase'
import Filter from '../../../Filter/Filter';
import Time from '../../../Time/Time';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Category = () => {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({}) 
  const db = getFirestore();

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://project-give-and-take.onrender.com/products');
        const allItems = response.data.data;
        console.log("כל החפצים",allItems)
        const categoryItems = allItems.filter(item => item.category === category);
        
        setItems(categoryItems);
        console.log(" החפצים מהקטגוריה",categoryItems)
        setFilteredItems(categoryItems)// ברירת מחדל
        setLoading(false);

        console.log("Category from URL:", category);
        console.log("Categories in data:", allItems.map(item => item.category));


        const userId = auth.currentUser?.uid;// גישה למזהה המשתמש הנוכחי
        if (userId) {
          const userRef = doc(db, "users", userId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userFavorites = userDoc.data().favorites || [];
            const favoriteState = {};
            userFavorites.forEach(id => favoriteState[id] = true);
            setFavorites(favoriteState);
          } else {
            console.log("User document does not exist");
          }
        } else {
          console.log("User is not logged in");
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData(); 
  }, [db, category]);

  const toggleFavorite = async (id) => {
    const userId = auth.currentUser?.uid;

    if (userId) {
      const userRef = doc(db, "users", userId);
      const isFavorite = favorites[id];

      try {
        if (isFavorite) {
          await updateDoc(userRef, {
            favorites: arrayRemove(id)
          });
          // // הצגת הודעת הצלחה
          // toast.success("החפץ נשמר בהצלחה!", {
          // position: "top-center",
          // autoClose: 2000, // נסגר אוטומטית לאחר 2 שניות
          // style: { backgroundColor: "white", color: "green" },
          // });          
        } else {
            await updateDoc(userRef, {
              favorites: arrayUnion(id)
            });
            // הצגת הודעת הצלחה
            toast.success("החפץ נשמר בהצלחה!", {
            position: "top-center",
            autoClose: 2000, // נסגר אוטומטית לאחר 2 שניות
            style: { backgroundColor: "white", color: "green" },
            });
        }
        setFavorites((prevFavorites) => ({
          ...prevFavorites,
          [id]: !prevFavorites[id]
        }));
      } catch (error) {
        console.error("Error updating favorites:", error);
      }
    } else {
      console.log("User is not logged in.");
    }
  };

    // פונקציה שמסננת את הפריטים לפי המיקום והמצב
  const applyFilter = (state, location) => {
    console.log(state,location)
    let filtered = items;
    console.log("חפצים מסוננים " ,items)
    // סינון לפי מיקום
    if (location) {
      filtered = filtered.filter(item => item.location === location);
      
    }
    console.log(filtered)
      
    // סינון לפי מצב
    if (state) {
      filtered = filtered.filter(item => item.state === state);
    }
    console.log(filtered)
    setFilteredItems(filtered);
  }

  if (loading) {
    return <div>...בטעינה</div>;
  }

  return (
    <div>
    <h1 className="text-2xl font-bold text-center my-4">{category}</h1>
    <div className="flex">
      <div className="w-3/4"> {/* רוחב של ה-Outlet (75% מהרוחב הכולל) */}
        {filteredItems.length === 0 ? ( // בדיקה אם אין חפצים מסוננים
          <p className="text-center text-lg font-semibold">לא נמצאו חפצים </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => ( //  להציג את החפצים המסוננים 
              <li key={item._id} className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <Link to={`/Item/oneobject/${item._id}`}>
                    <img 
                      src={item.avatar} 
                      alt={item.objectName} 
                      className="object-cover w-full h-full rounded-lg shadow-lg hover:scale-110"
                    />
                  </Link>
                  <button 
                    className="absolute top-2 right-2 text-xl "
                    onClick={() => toggleFavorite(item._id)}
                  >
                    {favorites[item._id] ? <MdOutlineStar /> : <MdOutlineStarBorder />}
                  </button>
                </div>
                <p className="mt-2 text-lg font-semibold">{item.objectName}</p>
                <p className="text-sm text-gray-600">{item.location}</p>
                <Time uploadTime={item.uploadTime}/>
              </li>
            ))}
          </ul>
        )}
      </div>       
      <div className="w-1/4"> {/* רוחב של הפילטר (25% מהרוחב הכולל) */}  
        <Filter onFilterSubmit={applyFilter} />
      </div>
    </div>
                {/* הקומפוננט של Toast */}
                <ToastContainer /> 
  </div>
  );
}


export default Category