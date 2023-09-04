import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import TypeOfHealth from "../JsonFile/SelectTypeOfEditTextPage.json";
import styles from "../../styles/pages/EditHealthEducationEditor.module.scss";
import ReactQuill from "react-quill";
import { post } from "../axios";
import "react-quill/dist/quill.snow.css";
import "../../styles/fonts.css";

export default function EditHealthEducationEditor() {
  const [title, setTitle] = useState("");

  const Quill = ReactQuill.Quill;
  var Font = Quill.import("formats/font");
  Font.whitelist = ["JhengHei", "PMingLiU", "Roboto"];
  Quill.register(Font, true);

  const modules = {
    toolbar: [
      [{ container: "custom-toolbar" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: Font.whitelist }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ color: ["red", "#785412"] }],
      [{ background: ["red", "#785412"] }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "image",
    "background",
    "align",
    "size",
    "font",
  ];

  const [code, setCode] = useState("hellllo");
  const handleProcedureContentChange = (content, delta, source, editor) => {
    setCode(content);
    //let has_attribues = delta.ops[1].attributes || "";
    //console.log(has_attribues);
    //const cursorPosition = e.quill.getSelection().index;
    // this.quill.insertText(cursorPosition, "★");
    //this.quill.setSelection(cursorPosition + 1);
  };

  const handleSubmitHealthEducation = (e) => {
    e.preventDefault();
    console.log("submit");
    const data = new FormData();
    data.append("title", title);
    data.append("content", code);
    uploadPaper({ data });
  };

  const uploadPaper = async ({ data }) => {
    try {
      const res = await post("healthedPaper", data);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <Col>
        <Row>
          <h1>資料新增/修改</h1>
        </Row>
        <Row>
          <Row>
            <Form.Group className="mb-3" controlId="healthEducation.TitleEdit">
              <Form.Label>標題</Form.Label>
              <Form.Control
                type="text"
                placeholder="請在此填入標題"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </Form.Group>
          </Row>
          {/* <Row>
            <Form.Group className="mb-3" controlId="healthEducation.TypeSelect">
              <Form.Label>類別</Form.Label>
              <Form.Select aria-label="Default select example">
                {TypeOfHealth.map((item, index) => (
                  <option key={item.id} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row> */}
          <Row className="mb-3">
            <Row>衛教內容</Row>
            <Col>
              {console.log(code)}
              <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                value={code}
                onChange={handleProcedureContentChange}
              />
            </Col>
          </Row>
          <Row>
            <Button
              variant="primary"
              type="submit"
              onClick={handleSubmitHealthEducation}
            >
              儲存
            </Button>
          </Row>
        </Row>
      </Col>
    </Container>
  );
}
