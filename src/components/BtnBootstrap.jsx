import React from "react";
import Button from "react-bootstrap/Button";

/**
 * 這個 component 主要使用於 React 版本的 Bootstrap 中的 button。
 *
 * @param {Object} props - 組件的 props。
 * @param {string} props.btnID - 該按鍵的 ID 名稱。
 * @param {string} props.btnName - 該按鍵的 name 名稱，通常使用於表單中識別。
 * @param {string} [props.btnPosition] - 可不填寫，在此定義為按鍵的 class 名稱並搭配 React-BootStrap 的 spacing 參數進行調整按鍵位置。
 * @param {('submit'|'button')} [props.btnType] - 可不填寫，在此定義為按鍵類型。
 * @param {('lg'|'md'|'sm'|'xl'|'xs')} [props.btnSize] - 可不填寫，在此定義為按鍵的大小。
 * @param {string} [props.btnTitle] - 可不填寫，在此定義為按鍵的 title 屬性。
 * @param {Function} props.onClickEventName - 該按鍵的點擊事件。
 * @param {string} props.text - 該按鍵要顯示於畫面上的文字。
 * @param {boolean} [props.disabled=false] - 可配合一些條件運算讓按鍵無法被按下。
 * @param {('primary'|'secondary'|'success'|'warning'|'danger'|'info'|'light'|'dark')} props.variant - 在此有八種樣式，可參考：https://react-bootstrap.github.io/components/buttons/
 *
 * @returns {JSX.Element} 一個 Bootstrap button 組件。
 * @version 1.0.0
 */

const BtnBootstrap = ({
  btnID,
  btnName,
  btnPosition = "float-end",
  btnType = "button",
  btnSize = "lg",
  btnTitle,
  onClickEventName,
  text,
  disabled = false,
  variant,
  ariaLabelName,
}) => {
  return (
    <Button
      id={btnID}
      name={btnName}
      size={btnSize}
      className={btnPosition}
      type={btnType}
      variant={variant}
      onClick={onClickEventName}
      disabled={disabled}
      title={btnTitle}
      aria-label={ariaLabelName}
    >
      {text}
    </Button>
  );
};

export default BtnBootstrap;
