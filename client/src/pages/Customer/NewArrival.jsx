import React from 'react';
import Shop from './Shop'; // Adjust the import path if necessary

const NewArrival = ({ onAddToCart }) => {
  // Shop.jsx internal logic will automatically detect the "/shop/new-arrivals" 
  // path and trigger the getProcessedProducts() date sorting.
  return (
    <Shop onAddToCart={onAddToCart} />
  );
};

export default NewArrival;