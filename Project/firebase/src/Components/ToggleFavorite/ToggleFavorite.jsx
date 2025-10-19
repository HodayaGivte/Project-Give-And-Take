import { useEffect, useState } from 'react';
import { auth } from '../LoginSignup/firebase';
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';

const ToggleFavorite = () => {
  const [favorites, setFavorites] = useState({});
  const db = getFirestore();
  
  // פונקציה לטעינת המועדפים מהמאגר
  const fetchData = async () => {
    try {
      const userId = auth.currentUser?.uid; // גישה למזהה המשתמש הנוכחי
      if (userId) {
        const userRef = doc(db, 'users', userId);// הפניה למסמך של המשתמש
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userFavorites = userDoc.data().favorites || [];
          const favoriteState = {};
          userFavorites.forEach((id) => (favoriteState[id] = true));
          setFavorites(favoriteState);
        } else {
          console.log('User document does not exist');
        }
      } else {
        console.log('User is not logged in');
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData(); // טען את המועדפים כאשר הקומפוננטה נטענת
  }, [db]); 

  const toggleFavorite = async (id) => {
    const userId = auth.currentUser?.uid;

    if (userId) {
      const userRef = doc(db, 'users', userId);
      const isFavorite = favorites[id];

      try {
        if (isFavorite) {
          await updateDoc(userRef, {
            favorites: arrayRemove(id),
          });
        } else {
          await updateDoc(userRef, {
            favorites: arrayUnion(id),
          });
        }
        setFavorites((prevFavorites) => ({
          ...prevFavorites,
          [id]: !prevFavorites[id],// אם טרו נהפוך לפולס ולהיפך
        }));
      } catch (error) {
        console.error('Error updating favorites:', error);
      }
    } else {
      console.log('User is not logged in.');
    }
  };

  return { favorites, toggleFavorite };
};

export default ToggleFavorite;

