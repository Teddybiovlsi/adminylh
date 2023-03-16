function CardTitleFunction({ TitleName = "" }) {
  return (
    <h1>
      <strong>{TitleName}</strong>
    </h1>
  );
}
function CardSecondTitleFunction({ TitleName = "" }) {
  return (
    <h2>
      <strong>{TitleName}</strong>
    </h2>
  );
}

export { CardTitleFunction, CardSecondTitleFunction };
