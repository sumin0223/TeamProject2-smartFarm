// src/api/market/api.js
import backendServer from "../backendServer";
import requests from "../request";

/* =========================
   ADMIN PRODUCT API
========================= */

// 관리자 상품 전체 조회
export const fetchAdminProducts = () =>
  backendServer.get(requests.adminProductList);

// 관리자 상품 단건 조회
export const fetchAdminProductById = (productId) =>
  backendServer.get(requests.adminProductDetail(productId));

// 관리자 상품 생성
export const createAdminProduct = (data) =>
  backendServer.post(requests.adminProductList, data);

// 관리자 상품 수정
export const updateAdminProduct = (productId, data) =>
  backendServer.put(requests.adminProductDetail(productId), data);

// 관리자 상품 삭제
export const deleteAdminProduct = (productId) =>
  backendServer.delete(requests.adminProductDetail(productId));
