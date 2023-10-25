const convertType = (type) => {
  const typeMap = {
    0: "練習",
    1: "測驗",
    2: "基礎練習",
  };
  return typeMap[type] || "練習";
};

export default convertType;
