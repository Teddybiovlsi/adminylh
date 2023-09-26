const PwdStrengthMeter = ({ pwdScore }) => {
  const num = (pwdScore * 100) / 4;

  const passwordLevels = {
    0: { label: "非常弱:無法通過", color: "#828282" },
    1: { label: "弱:無法通過", color: "red" },
    2: { label: "中等", color: "orange" },
    3: { label: "強", color: "blue" },
    4: { label: "非常強", color: "green" },
  };

  const createPassLabel = () => {
    return passwordLevels[pwdScore]?.label || "";
  };

  const funcProgressColor = () => {
    return passwordLevels[pwdScore]?.color || "none";
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
      <p
        style={{
          color: funcProgressColor(pwdScore),
          textAlign: "right",
          margin: 0,
        }}
      >
        {createPassLabel(pwdScore)}
      </p>
    </>
  );
};

export default PwdStrengthMeter;
