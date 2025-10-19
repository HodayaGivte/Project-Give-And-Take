import React from 'react'
import { Link } from 'react-router-dom'
import { NavbarManue } from '../../data'
  
import { useLocation } from 'react-router-dom';

const HomePage = () => {
  const location = useLocation();
  const formData = location.state || {}; 

  return (
  <>
    {/*קטגוריות*/}
    <div className="container mx-auto py-16">
      <div className="grid grid-cols- gap-6 md:grid-cols-4">
        {NavbarManue.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <a href={item.link}>
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 rounded-full shadow-lg mb-2 hover:scale-110"
              />
            </a>
            <span className="text-center text-gray-700 font-semibold">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
     {/*פרסום חפצים*/}
    <Link to='../../Form'>
      <div>
        <button className='bg-yellow-400 text-black font-semibold 
        hover:bg-yellow-300 rounded-md px-14 py-3 duration-200 mx-auto block'>
              +פרסום חפצים
        </button>
      </div>
    </Link>
    <div>
    </div> 
  </>

  )
}

export default HomePage