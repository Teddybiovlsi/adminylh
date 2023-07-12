# 後台管理端說明文件

## 主要會有兩個資料夾

- **components**
- **Form**

## components

components 的資料夾細分成:

- **[主頁面](./components/index.jsx):**
- **[創建帳號畫面](./components/):**
- **[導覽頁面]():**
- **[版權宣告頁面](./components/AboutUs.jsx):**

## Form

Form 的資料夾內細分成:

- **[帳號類表單](./Form/Account/):** 用於創建使用者、後台管理人員帳號
- **[影片資訊類表單](./Form/CreateVideoForm/):** 創建(練習用/測驗用)表單
- **[共用元件庫](./Form/shared/)** 表單用元件放置於此
  - **[函式庫](./Form/shared/func/)** 表單用函式放置於此
  - **[模組化CSS](./Form/shared/scss/)** 模組化 CSS 樣式表單放置於此，切記! SCSS 檔案若要模組化需要以 **{檔名.module.scss}** 此方式進行命名

## 其他注意事項

- 若發生413 (Content Too Large) 則需要更改後端的設定檔案
- 如xampp則需更改 **php.ini** 檔案
- 更改的變數名稱如下：
  1. **[post_max_size]** 更改上傳大小
  2. **[upload_max_filesize]** 更改上傳的檔案大小
  3. **[max_execution_time]** 更改上傳的檔案時間
   