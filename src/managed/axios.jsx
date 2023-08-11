import _axios from "axios";

const axios = (baseURL, passType = "multipart/form-data") => {
  // 建立自訂義的axios
  const instance = _axios.create({
    baseURL: baseURL || "http://140.125.35.8:8079/ntuh_laravel_API/public/", //JSON-Server端口位置
    headers: { "Content-Type": passType, charset: "utf-8" },
    timeout: 5000,
  });

  return instance;
};

// make axios get request api from the baseURL and /api/v1/GET/ + path
export const get = (path) => axios().get(`api/v1/GET/${path}`);
// make axios post request api from the baseURL and /api/v1/POST/ + path
export const post = (path, data) => axios().post(`api/v1/POST/${path}`, data);
// make axios put request api from the baseURL and /api/v1/PUT/ + path
export const put = (path, data) =>
  axios(
    "http://140.125.35.8:8079/ntuh_laravel_API/public/",
    "application/x-www-form-urlencoded"
  ).put(`api/v1/PUT/${path}`, data);
// make axios delete request api from the baseURL and /api/v1/DELETE/ + path
export const del = (path) => axios().delete(`api/v1/DELETE/${path}`);

export { axios };
export default axios();
