import React from "react";
import PropTypes from "prop-types";
import { Helmet, HelmetProvider } from "react-helmet-async";

/**
 *
 * @param {string} title - 分頁上的標籤文字
 * @returns {JSX.Element} 一個顯示分頁上的標籤文字的 component。
 * @version 1.0.0
 */
const PageTitle = ({ title }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
      </Helmet>
    </HelmetProvider>
  );
};

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;
