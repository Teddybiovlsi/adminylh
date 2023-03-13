import React from "react";
import styles from "../SCSS/FooterStyle.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
  return (
    <div id={styles.footerStyle}>
      <small>&copy; Dr H Group, 2023. All rights reserved.</small>
    </div>
  );
}
export default Footer;
