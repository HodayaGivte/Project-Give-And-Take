import './SignupForm.css'
import { Link, useNavigate } from "react-router-dom";
import { auth, firestore } from './firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useState } from "react";
import { setDoc, doc, getDoc } from 'firebase/firestore'; 


const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); //יצירת נוויגאייט על מנת לעבור בדף ההתחברות לדף הראשי

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError(true);
      setErrorMessage("הסיסמה חייבת להיות באורך של לפחות 6 תווים");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError(true);
      setErrorMessage("יש למלא את כל השדות");
      return;
  }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      console.log("User signed up:", user);

      const userDocRef = doc(firestore, 'users', user.uid); // יצירת הפנייה למסמך
      const userDoc = await getDoc(userDocRef); // בדיקת אם המסמך קיים

      if (!userDoc.exists()) { // אם המסמך לא קיים
        await setDoc(userDocRef, { favorites: [] }); // יצירת המסמך עם שדה favorites כרשימה ריקה
      } else {
        console.log("User document already exists.");
      }
      navigate('/login');// ניווט לדף התחברות לאחר הרשמה תקינה

    } catch (err) {
      const errorMessage = err.message;
      const errorCode = err.code;

      setError(true);

      switch (errorCode) {
        case "auth/weak-password":
          setErrorMessage("סיסמה חלשה, אנא בחר/י סיסמה חזקה יותר");
          break;
        case "auth/email-already-in-use":
          setErrorMessage(  "כתובת אימייל זו כבר בשימוש" );
          break;
        case "auth/invalid-email":
          setErrorMessage("כתובת אימייל זו לא תקינה");
          break;
        case "auth/operation-not-allowed":
          setErrorMessage("אימייל/ סיסמה לא תקינים");
          break;
        case "auth/invalid-credential":
          setErrorMessage("הפרטים שהוזנו אינם תקינים, אנא נסה/י שוב");
          break;
        default:
          setErrorMessage(errorMessage);
          break;
      }
    }
  };

  return (
    <div className='signup-container'>
        <form className='signup-form' onSubmit={handleSubmit}>
            <h2>הרשמה</h2>
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
            
            <button type='submit'>הרשמה</button> <br />
            {error && <p>{errorMessage}</p>}
            <p className='newAcount'>
             קיים חשבון? <span><Link to="/login">התחבר/י</Link></span></p>
        </form>
    </div>
  )
}

export default SignUpForm