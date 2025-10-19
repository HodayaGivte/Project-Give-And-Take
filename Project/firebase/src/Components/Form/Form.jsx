import React, {useState, useEffect} from 'react' 
import "./Form.css"
import axios from 'axios'
import { useNavigate, useParams} from 'react-router-dom'// מעבר בין דפים בלחיצה
import { getAuth } from "firebase/auth"
import { initializeApp , getApps } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Back from '../Back/Back'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const firebaseConfig = {
  apiKey: "AIzaSyBLOboCNVHThmZpgZE1ri0X5M4o2IyW3hI",
  authDomain: "give-and-take-57b2f.firebaseapp.com",
  projectId: "give-and-take-57b2f",
  storageBucket: "give-and-take-57b2f.appspot.com",
  messagingSenderId: "293105294459",
  appId: "1:293105294459:web:8ac41fd6406174b777d6de",
};

// בדיקה אם קיימות אפליקציות שהאותחלו, אם לא – אתחול
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);


export default function Form({ productToEdit, setProductToEdit, isEditing, setIsEditing }) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [category, setCategory] = useState("")
  const [objectName, setObjectName] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [state, setState] = useState("")
  const [location, setLocation] = useState("")
  const [comments, setComments] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState({});


  const { id } = useParams()
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:5000/products/product/${id}`);
          const existingProduct = response.data;
          // עדכון השדות עם הנתונים הקיימים
          if (existingProduct) {
            setProductToEdit(existingProduct); // עדכון state עם המוצר שהתקבל
            setFirstName(existingProduct.firstName || "");
            setLastName(existingProduct.lastName || "");
            setPhone(existingProduct.phone || "");
            setCategory(existingProduct.category || "");
            setObjectName(existingProduct.objectName || "");
            setAvatar(existingProduct.avatar || null);
            setState(existingProduct.state || "");
            setLocation(existingProduct.location || "");
            setComments(existingProduct.comments || "");
            setIsEditing(true); // מצב עריכה
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      } else {
        setIsEditing(false); 
      }
    };

    fetchProduct(); 
  }, [id, setProductToEdit, setIsEditing]);
  


  const handleSubmit = async (e) => {
    e.preventDefault();  
    setLoading(true);
    
    const errors = {};
    const requiredMessage = 'שדה חובה*';

    if (!firstName) errors.firstName = requiredMessage;
    if (!lastName) errors.lastName = requiredMessage;
    if (!phone) errors.phone = requiredMessage;
    if (!category) errors.category = requiredMessage;
    if (!objectName) errors.objectName = requiredMessage;
    if (!avatar) errors.avatar = requiredMessage;
    if (!state) errors.state = requiredMessage;
    if (!location) errors.location = requiredMessage;
    if (!comments) errors.comments = requiredMessage;

    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors);
      setLoading(false);
      return;
    }

    if (!firstName || !lastName) {
      console.error('First name and last name are required');
      setLoading(false);
      return;  // אם ריק, מחזירים
    }

          // שליפת המזהה הייחודי מפיירבייס
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("User is not logged in");
        setLoading(false);
        return;
      }

      const userId = user.uid; // מזהה המשתמש


    try {

      // אם התמונה לא הייתה קיימת, נעלה את התמונה ל-Firebase Storage
      let avatarUrl = avatar;
      if (avatar) {
        const storageRef = ref(storage, `avatars/${Date.now()}_${avatar.name}`);// הפניה למיקום שבו התמונה תשמר בפייר סטוראג
        await uploadBytes(storageRef, avatar);
        avatarUrl = await getDownloadURL(storageRef);
      }
      console.log(avatarUrl)
    // אם אנחנו במצב עריכה, נביא את המידע הקיים
      if (isEditing && productToEdit && productToEdit._id) {
        await axios.put(`http://localhost:5000/products/${productToEdit._id}`, {
          firstName,
          lastName,
          phone,
          category,
          objectName,
          // avatar,
          avatar: avatarUrl,
          state,
          location,
          comments,
          userId, 
        });
      } else {
        await axios.post("http://localhost:5000/products", {
          firstName,
          lastName,
          phone,
          category,
          objectName,
          // avatar,
          avatar: avatarUrl,
          state,
          location,
          comments,
          userId, 
        });
      }

      console.log(firstName)
      console.log(lastName)

      if(firstName && lastName
           && phone && category&& objectName
           && avatar && state && location&& comments
      ){
          console.log("in")
          // הצגת הודעת הצלחה
          toast.success("הטופס נשלח בהצלחה!", {
          position: "top-center",
          autoClose: 2000, // נסגר אוטומטית לאחר 2 שניות
          style: { backgroundColor: "green", color: "white" },
          });
          
          // ניווט לדף הראשי לאחר זמן ההודעה
          setTimeout(() => {
          navigate('/Item/homepage');
          }, 2000); // תזמון של 3 שניות (משך תצוגת ההודעה)
          
          //  navigate('/Item/homepage')
       }
    } catch (error) {
      console.error('There was an error!', error);
      console.log("Error details:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };  
    return(
      <>
        <span class="block text-center font-bold text-3xl mt-10">טופס להעלאת חפצים</span>

        <form onSubmit={handleSubmit} className="flex flex-col mx-auto 
        my-[50px] mb-[200px] bg-white text-right items-center">
           <div className="mt-[35px] flex flex-col gap-[5px]">
            <label htmlFor="firstName">שם פרטי</label>
            {errorMessage.firstName && <p style={{ color: 'red', fontSize: '12px' }}>{errorMessage.firstName}</p>}
            <input className='input'
               type="text"
               name="firstName"
               value={firstName}
               onChange={(e) => setFirstName(e.target.value)}/>

            <label htmlFor="lastName">שם משפחה</label>
            {errorMessage.lastName && <p style={{ color: 'red', fontSize: '12px' }}>{errorMessage.lastName}</p>}
            <input className='input'
               type="text"
               name="lastName"
               value={lastName}
               onChange={(e) => setLastName(e.target.value)} />

            <label htmlFor="phone">מספר טלפון</label>
            {errorMessage.phone && <p style={{ color: 'red', fontSize: '12px' }}>{errorMessage.phone}</p>}
            <input className='input'
               type="tel"
               name="phone"
               value={phone}
               onChange={(e) => setPhone(e.target.value)}/>

            <label htmlFor="category">קטגוריה</label>
            {errorMessage.category && <p style={{ color: 'red', fontSize: '12px' }}>{errorMessage.category}</p>}
            <select className='input' name="category"  value={category}
               onChange={(e) => setCategory(e.target.value)}>
                <option value="">-- בחר קטגוריה --</option>
                <option value="ריהוט וכלי בית">ריהוט וכלי בית</option>
                <option value="חשמל">חשמל</option>
                <option value="לחצר ולגינה">לחצר ולגינה</option>
                <option value="ספרים ומדיה">ספרים ומדיה</option>
                <option value="לתינוק ולילד">לתינוק ולילד</option>
                <option value="ביגוד ואופנה">ביגוד ואופנה</option>
                <option value="ספורט">ספורט</option>
                <option value="תכשיטים">תכשיטים</option>
            </select>

            <label htmlFor="objectName">שם המוצר</label>
            {errorMessage.objectName && <p style={{ color: 'red', fontSize: '12px' }}>{errorMessage.objectName}</p>}
            <input className='input'
               type="text"
               name="objectName"
               placeholder='שם המוצר'
               value={objectName}
               onChange={(e) => setObjectName(e.target.value)}/>

            <label htmlFor="image">העלאת תמונה</label>
            {errorMessage.avatar && <p style={{ color: 'red', fontSize: '12px' }}>{errorMessage.avatar}</p>}
            <input className='input'
               type="file" 
               accept="image/*" 
               onChange={(e) => setAvatar(e.target.files[0])}
            />
            {/* <label htmlFor="image">העלאת תמונה</label>
            {errorMessage.avatar && <p style={{ color: 'red', fontSize: '12px' }}>{errorMessage.avatar}</p>}
            <input className='input'
               type="url"
               name="avatar"
               id="image"
               placeholder =  "הזן כתובת url"
               value = {avatar}
               accept="image/*"
               onChange={(e) => setAvatar(e.target.value)}/> */}

            <fieldset>
              <legend className="mb-2">מצב החפץ</legend> 
              {errorMessage.state && <p style={{ color: 'red', fontSize: '12px' }}>{errorMessage.state}</p>}
              <div className="flex flex-col text-right">
                <label className="flex flex-row-reverse items-center mb-2">
                  <input type="radio" name="state" id="חדש באריזה" value="חדש באריזה" checked={state === "חדש באריזה"} onChange={(e) => setState(e.target.value)}/> 
                  <span className="mr-2">חדש באריזה</span>
                </label>
                <label className="flex flex-row-reverse items-center mb-2">
                  <input type="radio" name="state" id="משומש" value="משומש" checked={state === "משומש"} onChange={(e) => setState(e.target.value)}/>
                  <span className="mr-2">משומש</span>
                </label>
                <label className="flex flex-row-reverse items-center">
                  <input type="radio" name="state" id="דרוש תיקון" value="דרוש תיקון" checked={state === "דרוש תיקון"} onChange={(e) => setState(e.target.value)}/> 
                  <span className="mr-2">דרוש תיקון</span>
                </label>
              </div>
            </fieldset> 

            <label htmlFor="location">מיקום</label>
            {errorMessage.location && <p style={{ color: 'red', fontSize: '12px' }}>{errorMessage.location}</p>}
            <select className='input' name="location" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">-- בחר מיקום --</option>
                <option value="דרום">דרום</option>
                <option value="מרכז">מרכז</option>
                <option value="צפון">צפון</option>
            </select>

            <label htmlFor="comments" >הערות נוספות</label>
            {errorMessage.comments && <p style={{ color: 'red', fontSize: '12px' }}>{errorMessage.comments}</p>}
            <textarea className='input'
               name="comments"
               value={comments}
               onChange={(e) => setComments(e.target.value)}/>
            <br></br>
            <button className="flex justify-center items-center w-[150px] h-[32px]
              text-white bg-yellow-500 rounded-[10px] text-[15px] 
              font-bold cursor-pointer border-none hover:bg-yellow-600" 
              type="submit"> שליחה 
            </button>
            <Back/>
            {/* הקומפוננט של Toast */}
            <ToastContainer />    
         </div>
        </form>
      </>
    )
}