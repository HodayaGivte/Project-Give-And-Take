import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../LoginSignup/firebase'; 
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import Back from '../Back/Back';


const SaveObject = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

  
    useEffect(() => {
      const fetchFavorites = async () => {
        const user = auth.currentUser; // קבלת המשתמש הנוכחי
        if (user) {
          // קבלת ה-Token של המשתמש
        const token = await user.getIdToken();
            
          const userDocRef = doc(firestore, 'users', user.uid); // הפנייה למסמך המשתמש
          const userDoc = await getDoc(userDocRef); // קבלת המסמך
  
          if (userDoc.exists()) {
            const favoriteIds = userDoc.data().favorites; // שליפת ה-IDs של החפצים מהמסמך
            if (favoriteIds && favoriteIds.length > 0) {
              try {
                // קריאה לשרת כדי לקבל את פרטי החפצים ממונגו
                const response = await fetch('http://localhost:5000/products/saveobject', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // שליחת ה-Token ב-Header
                  },
                  body: JSON.stringify({ favoriteIds }), // שליחת ה-IDs לשרת
                });

                if (response.ok) {
                  const data = await response.json();
                  setFavorites(data.items); // שמירת פרטי החפצים המלאים בסטייט
                } else {
                  console.error('Failed to fetch items from server');
                }
              } catch (error) {
                console.error('Error fetching items:', error);
              }
            }          
          } else {
            console.log("No such document!");
          }
        }
        setLoading(false);
      };
  
      fetchFavorites();
    }, []);
  
    if (loading) return <div>...בטעינה</div>; // להציג הודעת טעינה
  
    return (
    <div>
      <h1 className="text-2xl font-bold text-center my-4">השמורים שלי</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {favorites.map((item, index) => (
        <li key={item.id || index} className="flex flex-col items-center">
        <div className="relative w-32 h-32">
        <Link to={`/Item/oneobject/${item._id}`}>
          <img 
            src={item.avatar} 
            alt={item.objectName} 
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </Link>
        </div>
        <p className="mt-2 text-lg font-semibold">{item.objectName}</p>
        <p className="text-sm text-gray-600">{item.location}</p>
        </li>
        ))}
      </ul>
      <Back/> 
    </div>
    )}
  
  export default SaveObject;