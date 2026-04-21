import React from 'react';
import Shop from './Shop'; // Adjust the path based on your file structure

const TopRated = ({ onAddToCart }) => {
  // This component acts as a shell that tells Shop.jsx to look at the URL
  // Your Shop.jsx logic already handles location.pathname === "/shop/top-products"
  return (
    <Shop onAddToCart={onAddToCart} />
  );
};

export default TopRated;