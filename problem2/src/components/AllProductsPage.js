
import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/apiService';
import ProductCard from './ProductCard';
import FilterComponent from './FilterComponent';

const AllProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        company: '',
        category: '',
        topN: 10,
        minPrice: 0,
        maxPrice: 10000
    });

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts(filters.company, filters.category, filters.topN, filters.minPrice, filters.maxPrice);
            setProducts(data);
        };
        fetchProducts();
    }, [filters]);

    return (
        <div>
            <FilterComponent filters={filters} setFilters={setFilters} />
            <div className="product-grid">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default AllProductsPage;
