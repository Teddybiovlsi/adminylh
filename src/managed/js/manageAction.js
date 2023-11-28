/**
 * 取得管理員當前所儲存的資料。
 *
 * @returns {Object} 管理員的個人資料。
 * 如果管理員已登入，則會從瀏覽器的本地儲存或會話儲存中取得用戶的個人資料。
 * 如果管理員未登入，則會回傳 null。
 * @example
 * const adminProfile = getAdminSession();
 * @version 1.0.0
 */
export const getAdminSession = () => {
  const user =
    sessionStorage.getItem("manage") || localStorage.getItem("manage");
  if (user) {
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error("Failed to parse user data: ", error);
    }
  }
  return null;
};
/**
 * 儲存管理員資料到瀏覽器的儲存空間。
 *
 * @param {Object} adminProfile - 管理員的個人資料。
 * @param {boolean} isRemember - 是否將資料儲存到本地：
 *   - true：將資料儲存到本地儲存，即使關閉瀏覽器，資料也會保留。
 *   - false：將資料儲存到會話儲存，當瀏覽器關閉時，資料將被清除。
 * @returns {Object} 用戶的個人資料。
 * @throws {Error} 如果 adminProfile 不是一個物件或是 null，則會拋出例外。
 * @throws {Error} 如果儲存失敗，則會拋出例外。
 * @example
 * const adminProfile = setAdminSession({
 *  id: 1,
 * name: "John Doe",
 * email: "123456@mail.com",
 * }, true);
 *
 *
 * @version 1.0.0
 */
export const setAdminSession = (adminProfile, isRemember = false) => {
  if (typeof adminProfile !== "object" || adminProfile === null) {
    throw new Error("adminProfile must be a non-null object");
  }

  const adminProfileString = JSON.stringify(adminProfile);

  try {
    const storage = isRemember ? localStorage : sessionStorage;
    storage.setItem("manage", adminProfileString);
  } catch (error) {
    throw new Error("Failed to store user profile: " + error.message);
  }

  return adminProfile;
};

/**
 * 若管理員登入後，伺服器回傳登入逾時或登出時，清除瀏覽器的本地儲存或會話儲存中的用戶資料。
 *
 * 會從兩個地方清除用戶資料，分別是：
 * 1. 本地儲存 (localStorage)
 * 2. 會話儲存 (sessionStorage)
 * @example
 * clearAdminSession();
 * @version 1.0.0
 */
export const clearAdminSession = () => {
  if (localStorage.getItem("manage")) {
    localStorage.removeItem("manage");
  }
  if (sessionStorage.getItem("manage")) {
    sessionStorage.removeItem("manage");
  }
};
