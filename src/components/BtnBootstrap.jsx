// 這個component主要使用於React版本的Bootstrap當中的button
// 參數一共有8個：btnID, btnName, btnPosition, btnType, onClickEventName, text, disabled, variant
// btnID: 該按鍵的ID名稱
// btnName: 該按鍵的name名稱 通常使用於表單中識別
// btnPosition: 可不填寫，在此定義為按鍵的class名稱並搭配React-BootStrap的spacing參數進行調整按鍵位置，可參考：https://mdbootstrap.com/docs/react/layout/float/
// onClickEventName: 該按鍵的點擊事件
// text: 該按鍵要顯示於畫面上的文字
// disabled：預設為false，可配合一些條件運算讓按鍵無法被按下
// variant: 在此有八種樣式primary, secondary, success, warning, danger, info, light, dark，可參考：https://react-bootstrap.github.io/components/buttons/

import React from "react";
import Button from "react-bootstrap/Button";

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