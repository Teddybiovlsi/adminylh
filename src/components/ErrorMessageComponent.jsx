import React from "react";
import styles from "../styles/components/Common.module.scss";

export default function ErrorMessageComponent({
  title = "",
  errorMessage = "",
}) {
  return (
    <div className="container">
      <h1 className={styles.container_firstHeading}>影片資訊欄位</h1>
      <div className={styles.container_division}>
        <h2 className={styles.container_division_secondHeading}>
          {errorMessage}
        </h2>
      </div>
    </div>
  );
}
