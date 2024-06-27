import _axios from "axios";

const axios = (baseURL, passType = "multipart/form-data") => {
  // 建立自訂義的axios
  const instance = _axios.create({
    baseURL:
      baseURL || "https://ilchp01.yuntech.edu.tw/ntuh_api/public/index.php/", //JSON Server的伺服器位址
    // baseURL || "http://140.125.35.8:8079/ntuh_laravel_API/public/", //Laravel的伺服器位址
    headers: {
      "Content-Type": passType,
      charset: "utf-8",
    },
    timeout: 30000,
  });

  return instance;
};

// make axios get request api from the baseURL and /api/v1/GET/ + path
export const get = (path) => axios().get(`api/v1/GET/${path}`);
// make axios post request api from the baseURL and /api/v1/POST/ + path
export const post = (path, data) => axios().post(`api/v1/POST/${path}`, data);
// make axios put request api from the baseURL and /api/v1/PUT/ + path
/**
 * 使用PUT方法向指定API路徑傳遞資料
 * @param {string} path  API的相對路徑。完整的API路徑將是http://140.125.35.8:8079/ntuh_laravel_API/public/api/v1/PUT/ 加上這個參數。
 * @param {Object} data  欲傳遞的資料，應該是一個對象，其中的屬性將被轉換為x-www-form-urlencoded格式。
 * @returns {Promise} 返回一個Promise對象，當請求完成時，這個Promise將會解析為伺服器的回應。
 * @example
 * put("Video", { title: "My Video", description: "This is my video" })
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const put = (path, data) =>
  axios(
    "https://ilchp01.yuntech.edu.tw/ntuh_api/public/index.php/",
    // "http://140.125.35.8:8079/ntuh_laravel_API/public/", //Laravel的伺服器位址
    "application/x-www-form-urlencoded"
  ).put(`api/v1/PUT/${path}`, data);
// make axios delete request api from the baseURL and /api/v1/DELETE/ + path
export const del = (path) => axios().delete(`api/v1/DELETE/${path}`);

export { axios };
export default axios();
