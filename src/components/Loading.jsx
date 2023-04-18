import React from "react";
import styles from "../styles/components/Loading.module.scss";

export default function Loading({ text = "載入中" }) {
  return (
    <>
      <div className={styles.loadingDivision}>
        <h1 className={`${styles.loadingDivision_headingText} me-3`}>{text}</h1>
        <div className={styles.dots}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
}
