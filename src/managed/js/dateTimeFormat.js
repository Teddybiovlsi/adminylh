/**
 * 轉換時間戳記為格式化日期格式或時間字串。
 *
 * @param {number} time - 資料庫所回傳的時間戳記.
 * @param {string} type - 要進行的轉換類型。
 *                        如果為 "date"，則函數返回日期字串。
 *                        如果為 "time"，則函數返回時間字串。
 * @returns {string} 格式化的日期或時間字串。
 * @version 1.0.0
 */
export const convertTimestampToDateOrTime = (time, type) => {
  if (type === "date") {
    return new Date(time).toLocaleDateString();
  }
  if (type === "time") {
    return new Date(time).toLocaleTimeString();
  }
};

/**
 * 轉換時間戳記為格式化日期時間字串。
 * @param {number} time - 資料庫所回傳的時間戳記。
 * @returns {string} 格式化的日期時間字串。
 * @version 1.0.0
 */
export const handleConvertTime = (time) => {
  const hour = Math.floor(time / 3600);
  const minute = Math.floor((time % 3600) / 60);
  const second = Math.floor((time % 3600) % 60);
  return `${hour}小時${minute}分鐘${second}秒`;
};
