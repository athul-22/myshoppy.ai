import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';
console.log('API base URL:', API_BASE_URL);

axios.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

axios.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
}, error => {
  console.error('Response Error:', error);
  return Promise.reject(error);
});

export const fetchProducts = async (productName, page = 1, limit = 20, category = '', geoLocation = '') => {
  console.log(`Calling API with productName: "${productName}"`);
  try {
    console.log('Making request to:', `${API_BASE_URL}/scrape`);
    const response = await axios.get(`${API_BASE_URL}/scrape`, {
      params: {
        productName,
        page,
        limit,
        category,
        geoLocation
      }
    });
    
    console.log('API Response status:', response.status);
    console.log('API Response data type:', typeof response.data);
    console.log('API Response data length:', Array.isArray(response.data) ? response.data.length : 'Not an array');
    
    // Parse prices to numbers if they're strings
    const products = response.data.map(product => ({
      ...product,
      price: typeof product.price === 'string' ? 
        parseFloat(product.price.replace(/[₹,]/g, '')) : 
        product.price
    }));
    
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    console.error('Error response:', error.response ? {
      status: error.response.status,
      data: error.response.data
    } : 'No response');
    throw error;
  }
};