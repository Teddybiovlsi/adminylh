import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function ManageAccount() {
  const captchaRef = React.useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    // 处理表单提交
  };
  return (
    <form onSubmit={handleSubmit}>
      {/* 其他表单字段 */}
      <div>
        <ReCAPTCHA
          sitekey={import.meta.env.VITE_REACT_APP_SITE_KEY_2}
          badge="inline"
        />
      </div>
      {/* <button type="submit">提交</button> */}
    </form>
  );
}
