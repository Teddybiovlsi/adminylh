function SwitchNumToLanguage(languageNum) {
  switch (languageNum) {
    case 1:
      return "國語";
    case 2:
      return "台語";
    case 3:
      return "英文";
    case 4:
      return "英文";
    case 5:
      return "越南文";
    case 6:
      return "泰文";
    case 7:
      return "印尼語";
    case 8:
      return "菲律賓語";
    default:
      return "";
  }
}

function SwitchNumToType(TypeNum) {
  switch (TypeNum) {
    case 1:
      return "疾病照護";
    case 2:
      return "活動";
    case 3:
      return "進食";
    case 4:
      return "管路照護及異常處理";
    case 5:
      return "皮膚照護";
    case 6:
      return "傷口照護";
    case 7:
      return "預防合併症";
    default:
      return "";
  }
}

export { SwitchNumToLanguage, SwitchNumToType };
