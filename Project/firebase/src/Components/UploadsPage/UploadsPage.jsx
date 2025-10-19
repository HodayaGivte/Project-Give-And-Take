import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom'; 
import Back from '../Back/Back';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null); // עבור החפץ הנבחר למחיקה
  const [isPopupOpen, setIsPopupOpen] = useState(false); // עבור הפופאפ
  const [productToEdit, setProductToEdit] = useState(null); // פרטי החפץ לעריכה
  const [isEditing, setIsEditing] = useState(false); // האם אנו במצב עריכה

  const navigate = useNavigate(); 

  useEffect(() => {
    const auth = getAuth(); // יצירת אובייקט auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // קבלת מזהה מהמשתמש המחובר
      } else {
        console.error('No user found. Make sure the user is authenticated.'); 
      }
      setLoading(false);
    });

    return () => unsubscribe(); // ניקוי ההוק כשאין צורך יותר
  }, []);


  useEffect(() => {
    const fetchProducts = async () => {
        if (!userId) {
            console.log('Waiting for userId to be set...');
            return;
        }
      
      try {
        const response = await axios.get(`http://localhost:5000/products/${userId}`);
        console.log("Fetched products:", response.data)// בדיקה
        setProducts(response.data); // שמירת החפצים ב-state
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(); // קריאת האיי פי איי בעת טעינת הדף
  }, [userId]);

  if (loading) {
    return <div>...בטעינה</div>;
  }

  console.log("Products state after loading:", products); // בדיקה נוספת של הנתונים

    // פותח את הפופאפ כאשר לוחצים על כפתור המחיקה
    const handleDeleteClick = (product) => {

      console.log("Selected product for deletion:", product)

      if (!product || !product._id) {
        console.error("מוצר ללא מזהה לא ניתן למחוק.");
        return;
      }

      setDeleteProduct(product);
      setIsPopupOpen(true);
    };
  
    // סגירת הפופאפ
    const closePopup = () => {
      setIsPopupOpen(false);
      setDeleteProduct(null);
    };
  
    // פעולה למחיקת החפץ
    const confirmDelete = async () => {
      console.log("Delete product:", deleteProduct)
      console.log("Product ID:", deleteProduct ? deleteProduct._id : "לא קיים"); // הדפס את המזהה


      if (!deleteProduct || !deleteProduct._id) {
        console.error("מוצר לא מוגדר או שאין לו מזהה");
        return; // עצור את הפעולה אם המוצר לא תקין
      }else {
        console.log("Product ID is:", deleteProduct._id);
      }

      try {
        // בקשה לשרת למחיקת החפץ לפי ID
        await axios.delete(`http://localhost:5000/products/${deleteProduct._id}`);
        console.log('Product deleted successfully');
        closePopup(); // סגירת הפופאפ לאחר המחיקה
                  // הצגת הודעת הצלחה
                  toast.success("החפץ הוסר בהצלחה!", {
                  position: "top-center",
                  autoClose: 2000, // נסגר אוטומטית לאחר 2 שניות
                  style: { backgroundColor: "white", color: "green" },
                  });
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }

      //  פונקציה לטיפול בלחיצה על כפתור העריכה
    const handleEditClick = (product) => {
      if (product && product._id) {
        setProductToEdit(product);// שמירה על החפץ לעריכה
        setIsEditing(true);// העברת הטופס למצב עריכה
        navigate(`/form/${product._id}`);
      } else {
        console.error("Product ID is missing");
      }
    }  
 

  return (
    <div>
      <Back/>
      <h1 className="text-2xl font-bold text-center my-4">חפצים שהעלתי</h1>
      
      {products.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <li key={product._id} className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                <img 
                  src={product.avatar} 
                  alt={product.objectName} 
                  className="object-cover w-full h-full rounded-lg shadow-lg"
                />
              </div>
              <div className="flex items-center justify-center mt-2 w-full">
                <button onClick={() => handleDeleteClick(product)} className="text-red-500 mr-2">
                  <MdDelete />
                </button>
                <p className="text-lg font-semibold">{product.objectName}</p>
              </div>
              <div className="flex items-center justify-center mt-2 w-full">
                <button onClick={() => handleEditClick(product)} className="text-yellow-500 mr-7">
                  <MdEdit/>
                </button>
                <p className="text-sm text-gray-600">{product.location}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center my-4 text-lg font-semibold text-gray-500">
           לא נמצאו חפצים שהועלו על ידך
        </p>
      )}
        {/* פופאפ לאישור מחיקה */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-l font-semibold mb-4">האם אתה בטוח שברצונך למחוק את החפץ</h2>
            <div className="flex justify-center">
              <button 
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 mr-2"
                onClick={closePopup}
              >
                ביטול
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={confirmDelete} // קריאה לפונקציה שמבצעת את המחיקה
              >
                מחק
              </button>
            </div>
          </div> 
        </div>
      )}
                  {/* הקומפוננט של Toast */}
                  <ToastContainer />     
    </div>
  );
};

export default UploadsPage;
