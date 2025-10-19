import './Login.css'
import { Link, useNavigate } from "react-router-dom";
import { auth } from './firebase'
import { signInWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth'
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); //יצירת נוויגאייט על מנת לעבור בדף ההתחברות לדף הראשי

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError(true);
      setErrorMessage("יש למלא את כל השדות");
      return;
    }
    

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      const user = userCredential.user;
      console.log("User signed up:", user);
      
      // הצגת הודעת הצלחה
      toast.success("התחברת בהצלחה!", {
        position: "top-center",
        autoClose: 2000, // נסגר אוטומטית לאחר 2 שניות
        style: { backgroundColor: "green", color: "white" },
      });

      // ניווט לדף הראשי לאחר זמן ההודעה
      setTimeout(() => {
        navigate('/Item/homepage');
        }, 2000); // תזמון של 3 שניות (משך תצוגת ההודעה)


    } catch (err) {
      const errorMessage = err.message;
      const errorCode = err.code;

      setError(true);

      switch (errorCode) {
        case "auth/user-not-found":
          setErrorMessage("פרטי המשתמש לא קיימים במערכת... אנא הרשם/י");
          break;
        
        case "auth/invalid-email":
          setErrorMessage("כתובת האימייל שסופקה אינה תקינה");
          break;
        case "auth/wrong-password":
          setErrorMessage("הסיסמה שסופקה אינה תקינה");
          break;
        case "auth/invalid-credential":
          setErrorMessage("הפרטים שהוזנו אינם תקינים, אנא נסה/י שוב");
          break;
        case "auth/too-many-requests":
          setErrorMessage("נראה כי היו ניסיונות רבים מדי להתחברות. אנא נסה שוב מאוחר יותר או אפס את הסיסמה שלך.");
          break;  
        default:
          setErrorMessage(errorMessage);
          break;
      }
  
    }
  };
    const handleResetPassword = async () => {
        if (!validateEmail(email)) {
            setError({ email: 'כתובת אימייל אינה תקינה', password: '' });
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            console.log('איפוס סיסמה נשלח');
            setError({ email: '', password: '' });
        } catch (error) {
            setError({ email: 'שגיאה באיפוס סיסמה', password: '' });
        }
    };

  return (
    <div className='signup-container'>
        <form className='signup-form' onSubmit={handleSubmit}>
            <h2>התחברות</h2>
            <label htmlFor="email">
              <input type="text" 
               placeholder="מייל"
               onChange={handleChange}
               name="email"
               value={email}/>
              
            </label>
            <label htmlFor="password">
                <input type="password" 
                placeholder="סיסמה"
                onChange={handleChange}
                name="password"
                value={password}/>
            </label>
            
            <div onClick={handleResetPassword} className="forgot-password">
                שכחת סיסמה? <span>לחץ כאן</span>
            </div>
            <button type='submit'>התחברות</button> <br />

            {error && <p>{errorMessage}</p>}
            <p className='newAcount'>משתמש חדש? <Link to="/">הרשם/י</Link></p>
        </form>
        {/* הקומפוננט של Toast */}
        <ToastContainer />  
    </div>
  )
}

export default Login


