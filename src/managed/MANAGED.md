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
