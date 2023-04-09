// 此為後端API的axios接口，可視情況進行修改
import _axios from 'axios';

const axios = (baseURL) => {
  // 建立自訂義的axios
  const instance = _axios.create({
    baseURL: baseURL || 'http://140.125.35.82:8079/ntuh-API/public/api', //JSON-Server端口位置
    headers: { 'Content-Type': 'application/json' },
    timeout: 1000,
  });

  return instance;
};

export { axios };
export default axios();
