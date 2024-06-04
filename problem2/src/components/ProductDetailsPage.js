
import React from 'react';
import { useLocation } from 'react-router-dom';

const ProductDetailsPage = () => {
    const location = useLocation();
    const { product } = location.state;

    return (
        <div className="product-details">
            <h1>{product.name}</h1>
            <p>Company: {product.company}</p>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}</p>
            <p>Rating: {product.rating}</p>
            <p>Discount: {product.discount}%</p>
            <p>Availability: {product.availability ? 'In Stock' : 'Out of Stock'}</p>
        </div>
    );
};

export default ProductDetailsPage;
