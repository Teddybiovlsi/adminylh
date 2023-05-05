import React from "react";
import StatusCode from "./StatusCode";
// import { render, screen } from "@testing-library/react";
// import "@testing-library/jest-dom/extend-expect";

// test for the switch case in StatusCode.jsx
test("test for the switch case in StatusCode.jsx", () => {
  expect(StatusCode(102)).toBe("伺服器發生了連線錯誤，請稍後再試");
  expect(StatusCode(200)).toBe("成功");
  expect(StatusCode(303)).toBe("帳號已被註冊，請重新輸入");
  expect(StatusCode(400)).toBe("格式錯誤");
  expect(StatusCode(401)).toBe("請先登入");
  expect(StatusCode(403)).toBe("您沒有權限進行此操作");
  expect(StatusCode(404)).toBe("找不到請求之資源");
  expect(StatusCode(429)).toBe("請求過於頻繁");
  expect(StatusCode(500)).toBe("伺服器錯誤");
  expect(StatusCode(0)).toBe("未知錯誤");
});
