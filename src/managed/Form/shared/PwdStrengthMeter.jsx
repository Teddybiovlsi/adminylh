import React from "react";

const PwdStrengthMeter = ({ pwdScore }) => {
  const num = (pwdScore * 100) / 4;

  const createPassLabel = () => {
    switch (pwdScore) {
      case 0:
        return "非常弱:無法通過";
      case 1:
        return "弱:無法通過";
      case 2:
        return "中等";
      case 3:
        return "強";
      case 4:
        return "非常強";
      default:
        return "";
    }
  };

  const funcProgressColor = () => {
    switch (pwdScore) {
      case 0:
        return "#828282";
      case 1:
        return "red";
      case 2:
        return "orange";
      case 3:
        return "#A25188";
      case 4:
        return "Green";
      default:
        return "none";
    }
  };

  const changeStrengthBarColor = () => ({
    width: `${num}%`,
    background: funcProgressColor(pwdScore),
  });

  return (
    <>
      <div className="progress" style={{ height: "7px" }}>
        <div className="progress-bar" style={changeStrengthBarColor()}></div>
      </div>
      <p style={{ color: funcProgressColor(pwdScore), textAlign: "right" }}>
        {createPassLabel(pwdScore)}
      </p>
    </>
  );
};

export default PwdStrengthMeter;
