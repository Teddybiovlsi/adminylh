# [台大衛教系統 React version]

### 台大衛教系統中主要包含兩大主軸：

- **[客戶端](./src/client/):** 登入、觀看影片功能、調閱練習紀錄、察看衛教資訊以及用戶回饋
- **[後臺管理端](./src/frontend_sys/):** 登入、(新增/編輯/修改/刪除)影片資訊卡、後台帳號、客戶端帳號、觀看客戶端練習情形

### 專案解說：

- **[src](./src/):** 專案主軸皆在此資料夾內
  - **[assets](./src/assets/):** 圖檔放置的位置
  - **[client](./src/client/):** 客戶端 web 功能
  - **[managed](./src/managed/):** 管理端 web 功能
  - **[shared](./src/shared/):** 整個專案頻繁調用的元件庫
  - **[App.jsx](./src/App.jsx):** 路由功能(以後會由導覽列 Nav 實現)(尚未實作)
  - **[main.jsx](./src/main.jsx):** [主頁](./index.html)所調用的 React 檔案，**此專案底下使用嚴謹模式**
