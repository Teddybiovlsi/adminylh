import _axios from "axios";

const axios = (baseURL) => {
  // 建立自訂義的axios
  const instance = _axios.create({
    baseURL: baseURL || "https://randomuser.me/api/", //JSON-Server端口位置
    timeout: 1000,
  });

  return instance;
};

export { axios };
export default axios();