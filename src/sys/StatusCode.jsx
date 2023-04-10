import React from 'react';

export default function StatusCode({ statusCode }) {
  switch (statusCode) {
    case 200:
      return '成功';
    case 303:
      return '帳號已被註冊，請重新輸入';
    case 400:
      return '格式錯誤';
    case 401:
      return '請先登入';
    case 403:
      return '您沒有權限進行此操作';
    case 404:
      return '找不到請求之資源';
    case 500:
      return '伺服器錯誤';
    default:
      return '未知錯誤';
  }
}
