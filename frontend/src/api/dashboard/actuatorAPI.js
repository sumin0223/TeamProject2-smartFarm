import backendServer from "../backendServer";
import requests from "../request";

export const waterPlant = async (farmId) => {
  const res = await backendServer.get(requests.waterPlantManual, { params: { farmId } });
  return res.data;
};
