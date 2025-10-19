import React, { useEffect, useState } from 'react';

const Time = ({ uploadTime }) => {
  const [displayTime, setDisplayTime] = useState(new Date(uploadTime)); // שמירת הזמן קבוע

  useEffect(() => {
    // הגדרת הזמן בפעם הראשונה בלבד
    setDisplayTime(new Date(uploadTime));
  }, [uploadTime]); // רק בפעם הראשונה או אם uploadTime משתנה

  // קביעת השעה והדקות בפורמט 24 שעות
  const hours = String(displayTime.getHours()).padStart(2, '0');
  const minutes = String(displayTime.getMinutes()).padStart(2, '0');

  // מערך עם שמות החודשים
  const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

  // קביעת היום והחודש
  const day = String(displayTime.getDate()).padStart(2, '0'); // מוסיף 0 ליום במידת הצורך
  const month = months[displayTime.getMonth()]; // בחירת שם החודש ממערך החודשים

  // עיצוב התאריך עם שם החודש
  const formattedDate = `${day} ${month}`;
  const formattedTime = `${hours}:${minutes}`;

  return (
    <div className="mt-2">
      <div>
        <span className="text-sm text-gray-600">{formattedDate}</span>
      </div>
      {/* <div>
        <span className="font-semibold">שעה: {formattedTime}</span>
      </div> */}  
    </div>
  );
}

export default Time;

