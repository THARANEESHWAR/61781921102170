
import React from 'react';

const FilterComponent = ({ filters, setFilters }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    return (
        <div className="filters">
            <input type="text" name="company" value={filters.company} onChange={handleInputChange} placeholder="Company" />
            <input type="text" name="category" value={filters.category} onChange={handleInputChange} placeholder="Category" />
            <input type="number" name="topN" value={filters.topN} onChange={handleInputChange} placeholder="Top N" />
            <input type="number" name="minPrice" value={filters.minPrice} onChange={handleInputChange} placeholder="Min Price" />
            <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleInputChange} placeholder="Max Price" />
        </div>
    );
};

export default FilterComponent;
