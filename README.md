# 台大衛教系統 React version

## 台大衛教系統-管理端：
- **[後臺管理端](./src/frontend_sys/):** 登入、(新增/編輯/修改/刪除)影片資訊卡、後台帳號、客戶端帳號、觀看客戶端練習情形

## 專案解說：

- **[src](./src/):** 專案主軸皆在此資料夾內
  - **[assets](./src/assets/):** 圖檔放置的位置
  - **[client](./src/client/):** 客戶端 web 功能
  - **[managed](./src/managed/):** 管理端 web 功能
  - **[shared](./src/shared/):** 整個專案頻繁調用的元件庫
  - **[App.jsx](./src/App.jsx):** 路由功能(以後會由導覽列 Nav 實現)(尚未實作)
  - **[main.jsx](./src/main.jsx):** [主頁](./index.html)所調用的 React 檔案，**此專案底下使用嚴謹模式**

## 專案注意事項：

**第一次使用時，請透過[github 連結](https://github.com/Teddybiovlsi/ntuh_ReactVersion)下載 zip 檔案後，透過使用指令下載對應版本的套件**

```Terminal
npm i
```
**若要在本機執行本專案，請由Terminal執行以下指令**

```Terminal
npm run dev
```
專案底下的兩個檔案請勿直接進行修改!!，該檔案是由下載套件時自動生成
<br/>
兩個檔案內的資訊主要包含了當前使用 node 專案，如 vite、以及當前下載套件的版本號

- **[package-lock.json]**
- **[package.json]**

## 已完成頁面/元件/功能
### 頁面
 - [x] [登入頁面](/src/managed/Pages/Login.jsx)
 - [x] [首頁](/src/managed/Pages/Home.jsx)
 - [x] [使用者紀錄頁面](/src/managed/Pages/ManageClientRecord.jsx)
 - 使用者管理
   - [x] [帳號管理](/src/managed/Pages/ManageClientAccount.jsx)
   - [x] [紀錄管理](/src/managed/Pages/ManageClientRecord.jsx)

### 元件
 - [x] [路由保護](/src/AuthProtected.jsx)
 - [x] [導覽列](/src/managed/Header.jsx)
 - 影片類
  - [x] [編輯影片](/src/managed/Form/EditClientVideoQA.jsx)
### 功能
 - [x] [axios](/src/managed/axios.jsx)
 - [x] [密碼強度檢查](/src/managed/Form/shared/PwdStrengthMeter.jsx)

## 代辦事項
  - [x] [刪除影片功能]
  - 各頁面重新檢查並優化
  - 後台使用者管理頁面完成


## 製作團隊
本台大衛教系統係由Dr.H.Group研究團隊進行研發。<br>
研發成員為：顏銘德、高彬軒<br>
本專案託管由：顏銘德負責，聯絡資訊：M11113005@yuntech.edu.tw
