import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/components/DefaultPageTitleHeading.module.scss";

const styleOptionsMap = {
  1: styles.defaultPageHeadingStyle1,
  2: styles.defaultPageHeadingStyle2,
  3: styles.defaultPageHeadingStyle3,
  4: styles.defaultPageHeadingStyle4,
  5: styles.defaultPageHeadingStyle5,
  6: styles.defaultPageHeadingStyle6,
  7: styles.defaultPageHeadingStyle7,
  8: styles.defaultPageHeadingStyle8,
  9: styles.PageHeadingStyleForCreateVideo,
};

/**
 * 這個 component 用於顯示頁面的標題。
 *
 * @param {string} nameForClass - 用於自定義 class name
 * @param {string} text - 顯示的文字
 * @param {number} styleOptions - 用於已定義樣式
 *
 * @returns {JSX.Element} 一個顯示具有樣式標題的 component。
 * @version 1.0.0
 */

export default function PageTitleHeading({
  nameForClass,
  text,
  styleOptions = 1,
}) {
  const className =
    nameForClass || styleOptionsMap[styleOptions] || styleOptionsMap[1];

  return (
    <div>
      <h1 className={className}>{text}</h1>
    </div>
  );
}

PageTitleHeading.propTypes = {
  nameForClass: PropTypes.string,
  text: PropTypes.string.isRequired,
  styleOptions: PropTypes.number,
};
