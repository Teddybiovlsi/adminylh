import React from "react";

export default function Pagination({ data, rowsPerPage }) {
  const rows = data.length;
  //use last page number to calculate total page number
  const lastPage = Math.ceil(rows / rowsPerPage);
  //return rows and lastPage
  return { rows, lastPage };
}
