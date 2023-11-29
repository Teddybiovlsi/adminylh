/**
 * 比較兩個日期字串，並根據指定的排序類型進行排序。
 *
 * @param {string} a - 一個代表日期的字串。
 * @param {string} b - 一個代表日期的字串。
 * @param {string} [sortType="dsc"] - 排序類型。如果為 "asc"，則按照升序排序；如果為 "dsc" 或未提供，則按照降序排序。
 * @returns {number} 如果 a < b，返回負數；如果 a > b，返回正數；如果 a = b，返回 0。
 * @version 1.0.0
 */
export const compareDates = (a, b, sortType = "dsc") => {
  if (sortType === "asc") {
    return new Date(a).getTime() - new Date(b).getTime();
  } else {
    return new Date(b).getTime() - new Date(a).getTime();
  }
};

/**
 * 比較兩個分數，並按照升序排序。
 * @param {number} a - 一個代表分數的數字。
 * @param {number} b - 一個代表分數的數字。
 * @param {string} [sortType="dsc"] - 排序類型。如果為 "asc"，則按照升序排序；如果為 "dsc" 或未提供，則按照降序排序。
 * @returns {number} 如果 a < b，返回負數；如果 a > b，返回正數；如果 a = b，返回 0。
 * @version 1.0.0
 */
export const compareScores = (a, b, sortType = "dsc") => {
  if (sortType === "asc") {
    return a - b;
  } else {
    return b - a;
  }
};
