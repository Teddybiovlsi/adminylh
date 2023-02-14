import React from "react";
import PropTypes from "prop-types";
import { Form, InputGroup } from "react-bootstrap";

export function DynamicInput() {}

export function DynamicChoice(numbers) {
  let returnChoice;
  switch (numbers) {
    case 2:
      returnChoice = (
        <InputGroup>
          <InputGroup.Text>A</InputGroup.Text>
          <Form.Control
            aria-label="請輸入問題1 A選項的答案"
            placeholder="請填入A選項的答案"
          />
          <InputGroup.Radio aria-label="若此為正確答案請點選" />
          <InputGroup.Text>B</InputGroup.Text>
          <Form.Control
            aria-label="請輸入問題1 B選項的答案"
            placeholder="請填入B選項的答案"
          />
          <InputGroup.Radio aria-label="若此為正確答案請點選" />
        </InputGroup>
      );
      break;
    case 3:
      returnChoice = (
        <InputGroup>
          <InputGroup.Radio aria-label="若此為正確答案請點選" />
          <InputGroup.Text>A</InputGroup.Text>
          <Form.Control
            aria-label="請輸入問題1 A選項的答案"
            placeholder="請填入A選項的答案"
          />
          <InputGroup.Radio aria-label="若此為正確答案請點選" />
          <InputGroup.Text>B</InputGroup.Text>
          <Form.Control
            aria-label="請輸入問題1 B選項的答案"
            placeholder="請填入B選項的答案"
          />
          <InputGroup.Radio aria-label="若此為正確答案請點選" />
          <InputGroup.Text>C</InputGroup.Text>
          <Form.Control
            aria-label="請輸入問題1 C選項的答案"
            placeholder="請填入C選項的答案"
          />
          <InputGroup.Radio aria-label="若此為正確答案請點選" />{" "}
        </InputGroup>
      );
      break;
    case 4:
      <InputGroup>
        <InputGroup.Radio aria-label="若此為正確答案請點選" />
        <InputGroup.Text>A</InputGroup.Text>
        <Form.Control
          aria-label="請輸入問題1 A選項的答案"
          placeholder="請填入A選項的答案"
        />
        <InputGroup.Radio aria-label="若此為正確答案請點選" />
        <InputGroup.Text>B</InputGroup.Text>
        <Form.Control
          aria-label="請輸入問題1 B選項的答案"
          placeholder="請填入B選項的答案"
        />
        <InputGroup.Radio aria-label="若此為正確答案請點選" />
        <InputGroup.Text>C</InputGroup.Text>
        <Form.Control
          aria-label="請輸入問題1 C選項的答案"
          placeholder="請填入C選項的答案"
        />
        <InputGroup.Radio aria-label="若此為正確答案請點選" />
        <InputGroup.Text>D</InputGroup.Text>
        <Form.Control
          aria-label="請輸入問題1 D選項的答案"
          placeholder="請填入D選項的答案"
        />
        <InputGroup.Radio aria-label="若此為正確答案請點選" />{" "}
      </InputGroup>;
      break;
    default:
      returnChoice = null;
  }
}
