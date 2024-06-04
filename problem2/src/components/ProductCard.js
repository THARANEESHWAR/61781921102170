
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <img src={`https://picsum.photos/200?random=${Math.random()}`} alt={product.name} />
            <h2>{product.name}</h2>
            <p>${product.price}</p>
            <Link to={{ pathname: `/product/${product.id}`, state: { product } }}>
                View Details
            </Link>
        </div>
    );
};

export default ProductCard;
