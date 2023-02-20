import React from "react";

function CardTitleFunction({ TitleName = "" }) {
  return (
    <h1>
      <strong>{TitleName}</strong>
    </h1>
  );
}

export default CardTitleFunction;
