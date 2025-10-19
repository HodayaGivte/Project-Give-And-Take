import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Time from '../../../Time/Time';
import ToggleFavorite from '../../../ToggleFavorite/ToggleFavorite';
import { MdOutlineStarBorder, MdOutlineStar} from "react-icons/md";

const Oneobject = () => {
  const { productId } = useParams(); // מקבלת את ה-productId מהכתובת
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite } = ToggleFavorite();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/product/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching product details'); 
      }finally{
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <div>...בטעינה</div>;
  if (error) return <div>{error}</div>;

  // קבע את המצב של המועדף
  const isFavorite = favorites[product._id] || false;

  return (
  <div className="flex p-6 text-right">
    {/* פרטי החפץ בצד שמאל */}
    <div className="flex-grow pr-4 ">
    
      {/* מיקום */}
      <div className="mb-4">
        <span className="font-semibold">מיקום:</span> {product.location}
      </div>
  
      {/* הערות */}
      <div className="mb-4">
        <span className="font-semibold">הערות:</span> {product.comments}
      </div>
  
      {/* מצב החפץ */}
      <div className="mb-4">
        <span className="font-semibold">מצב החפץ:</span> {product.state}
      </div>
  
      {/* פרטים אישיים */}
      <div className="flex justify-end">
        <div className="border border-black p-2 rounded-lg w-1/3 text-center">
          <div className="mb-1">
            <span className="font-bold">{product.firstName}</span>
            <span className="font-bold mx-1">{product.lastName}</span>
          </div>
          <div>
            <span className="font-semibold">{product.phone}</span>
          </div>
        </div>
      </div>
      <Time uploadTime={product.uploadTime}/>
    </div>
  
    {/* תמונה בצד ימין */}
    <div className="flex-shrink-0 w-2/5 pl-5 relative">
      <img 
        src={product.avatar} 
        alt={product.objectName} 
        className="w-full h-auto rounded-lg shadow-lg" 
      />
      <button 
          className="absolute top-2 right-2 text-xl"
          onClick={() => toggleFavorite(product._id)}
          >
          {isFavorite ? <MdOutlineStar /> : <MdOutlineStarBorder />}
      </button>
      {/* שם החפץ */}
      <h2 className="text-xl font-bold mb-2 text-center">{product.objectName}</h2>
    </div>
  </div>
  


  );
}

export default Oneobject;
