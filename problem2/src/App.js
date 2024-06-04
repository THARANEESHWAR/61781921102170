
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllProductsPage from './components/AllProductsPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route exact path="/" element={<AllProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetailsPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
