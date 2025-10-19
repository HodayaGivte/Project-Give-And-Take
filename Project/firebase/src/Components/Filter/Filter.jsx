import React, {useState} from 'react' 

const Filter = ({ onFilterSubmit }) => {
  const [state, setState] = useState("")
  const [location, setLocation] = useState("")
  const [isFiltered, setIsFiltered] = useState(false)

  const handleFilterSubmit = (e) => {
    e.preventDefault();

    if (!isFiltered) {
      console.log("Submitting filter with:", { state, location }) 
      // קריאה לפונקציה שנשלחה מרכיב האב כדי להעביר את ערכי הסינון
      onFilterSubmit( state, location )
      setIsFiltered(true)
    } else {
      // לחיצה על ביטול סינון מאפס את הסינון הנבחר
      setState("");
      setLocation("");
      onFilterSubmit("", ""); // איפוס הסינון כדי להציג את כל החפצים
      setIsFiltered(false); 
    }
  }

  return (
    <>
      <div className="flex justify-end p-4">
        <div className="bg-white shadow-lg border rounded-sm p-4 w-[200px]">
          <label htmlFor="location" className="block text-right text-l font-medium mb-2">מיקום</label>
          <select className='block w-full text-right p-2 mb-4 border border-black-500 rounded-sm text-sm' name="location" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">-- כל הארץ --</option>
            <option value="דרום">דרום</option>
            <option value="מרכז">מרכז</option>
            <option value="צפון">צפון</option>
          </select>

          <fieldset className="mb-4">
          <legend className="block text-right text-l font-medium mb-2">מצב החפץ</legend>
            <div className="flex flex-col text-right space-y-2">
              <label className="flex items-center justify-end">
                <span className="ml-2 text-sm">חדש באריזה</span>
                <input type="radio" name="state" value="חדש באריזה" checked={state === "חדש באריזה"} onChange={(e) => setState(e.target.value)} className="form-radio text-indigo-600"/>
              </label>
              <label className="flex items-center justify-end">
                <span className="ml-2 text-sm">משומש</span>
                <input type="radio" name="state" value="משומש" checked={state === "משומש"} onChange={(e) => setState(e.target.value)} className="form-radio text-indigo-600"/>
              </label>
              <label className="flex items-center justify-end">
                <span className="ml-2 text-sm">דרוש תיקון</span>
                <input type="radio" name="state" value="דרוש תיקון" checked={state === "דרוש תיקון"} onChange={(e) => setState(e.target.value)} className="form-radio text-indigo-600"/>
              </label>
            </div>
          </fieldset>
          <button
            onClick={handleFilterSubmit}
            className="mt-4 bg-white text-black border border-gray-200 
            rounded-sm py-2 px-4 w-full hover:bg-gray-200 transition">
               {isFiltered ? "בטל סינון" : "סנן"}
          </button>
        </div>
      </div>
    </>
    
  )
}

export default Filter