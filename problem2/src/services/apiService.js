
import axios from 'axios';

const API_BASE_URL = 'http://20.244.56.144/test/';

const getProducts = async (company, category, topN, minPrice, maxPrice) => {
    const response = await axios.get(`${API_BASE_URL}companies/${company}/categories/${category}/products`, {
        params: {
            top: topN,
            minPrice: minPrice,
            maxPrice: maxPrice
        }
    });
    return response.data;
};

export { getProducts };
