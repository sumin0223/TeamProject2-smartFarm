import axios from 'axios';

const API_BASE = '/api/market'; // 백엔드 MarketController 기본 URL

/**
 * 상품 목록 조회
 * @param {string=} category - 'CROP' | 'DEVICE' | 'SERVICE'
 * @returns {Promise<Product[]>}
 */
export const getProducts = async (category) => {
  const params = category ? { category } : {};
  const response = await axios.get(`${API_BASE}/products`, { params });
  return response.data;
};

/**
 * 특정 상품 조회
 * @param {string} productId
 * @returns {Promise<Product>}
 */
export const getProductById = async (productId) => {
  const response = await axios.get(`${API_BASE}/products/${productId}`);
  return response.data;
};

/**
 * 상품 검색
 * @param {string} keyword
 * @returns {Promise<Product[]>}
 */
export const searchProducts = async (keyword) => {
  const response = await axios.get(`${API_BASE}/products/search`, { params: { q: keyword } });
  return response.data;
};

/**
 * 재고 조회
 * @param {string} productId
 * @returns {Promise<{ stock: number }>}
 */
export const getProductStock = async (productId) => {
  const response = await axios.get(`${API_BASE}/products/${productId}/stock`);
  return response.data;
};
