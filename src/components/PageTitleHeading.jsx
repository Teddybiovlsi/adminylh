import React from "react";
import styles from "../styles/components/DefaultPageTitleHeading.module.scss";

const optionSelector = (option) => {
  switch (option) {
    case 1:
      return styles.defaultPageHeadingStyle1;
    case 2:
      return styles.defaultPageHeadingStyle2;
    case 3:
      return styles.defaultPageHeadingStyle3;
    case 4:
      return styles.defaultPageHeadingStyle4;
    case 5:
      return styles.defaultPageHeadingStyle5;
    case 6:
      return styles.defaultPageHeadingStyle6;
    case 7:
      return styles.defaultPageHeadingStyle7;
    case 8:
      return styles.defaultPageHeadingStyle8;
    default:
      return styles.defaultPageHeadingStyle1;
  }
};

export default function PageTitleHeading({
  nameForClass,
  text,
  styleOptions = 1,
}) {
  return (
    <div>
      <h1
        className={nameForClass ? nameForClass : optionSelector(styleOptions)}
      >
        {text}
      </h1>
    </div>
  );
}
