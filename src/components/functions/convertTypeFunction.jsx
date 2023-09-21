const convertType = (type) => {
  const typeMap = {
    0: "練習",
    1: "測驗",
  };
  return typeMap[type] || "練習";
};

export default convertType;
