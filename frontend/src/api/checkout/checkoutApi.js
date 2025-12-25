import backendServer from "../backendServer";
import requests from "../request";

export const checkoutDirect = async (payload) => {
  const res = await backendServer.post(
    "/checkout/direct",
    payload,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const checkoutFromCart = async (
  payload
) => {
  const res = await backendServer.post(
    "/checkout/cart",
    payload,
    {
      withCredentials: true,
    }
  );
  return res.data;
};
