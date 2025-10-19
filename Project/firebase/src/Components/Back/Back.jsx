import { Link } from 'react-router-dom';
import React from 'react';

const Back = () => {
  return (
    <Link to="/Item/homepage">
      <div className="fixed left-4 top-4 bg-yellow-500 text-white text-center py-1 px-2 rounded-lg
       text-sm cursor-pointer hover:bg-yellow-600">
      חזרה לדף הראשי
      </div>
    </Link>
  );
};

export default Back;