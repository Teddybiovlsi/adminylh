import React from "react";
import { Form, Table } from "react-bootstrap";
import * as XLSX from "xlsx";

export default function AboutUs() {
  const [sheetData, setSheetData] = React.useState([]);
  const readUploadFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      workbook.SheetNames.forEach((sheet) => {
        const rowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );
        setSheetData(rowObject);
      });
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <>
        <Form.Group
          controlId="formFile"
          className="mb-3"
          onChange={readUploadFile}
        >
          <Form.Label>Default file input example</Form.Label>
          <Form.Control type="file" />
        </Form.Group>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>姓名</th>
              <th>身分證字號</th>
              <th>電子信箱</th>
              <th>密碼</th>
            </tr>
          </thead>
          <tbody>
            {sheetData.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.personID}</td>
                  <td>{item.email}</td>
                  <td>{item.pwd}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </>
    </div>
  );
}
