import React from "react";
import styles from "../SCSS/FooterStyle.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Footer() {
  return (
    <div id={styles.footerStyle}>
      <small>&copy; Dr H Group, 2023. All rights reserved.</small>
    </div>
    // <MDBFooter bgColor='light' className='text-center text-lg-left'>
    //   <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
    //     &copy; {new Date().getFullYear()} Copyright:{' '}
    //     <a className='text-dark' href='https://mdbootstrap.com/'>
    //       MDBootstrap.com
    //     </a>
    //   </div>
    // </MDBFooter>
  );
}
