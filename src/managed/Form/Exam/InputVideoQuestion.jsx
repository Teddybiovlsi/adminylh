import React, { Component } from "react";
import PageTitle from "../../../shared/Title";
import PropTypes from "prop-types";
import {
  Form,
  Card,
  InputGroup,
  FloatingLabel,
  FormLabel,
} from "react-bootstrap";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
// import styles from "./FormStyles.module.scss";
import { DynamicInput, DynamicChoice } from "../shared/DynamicInput";

class InputVideoQuestion extends Component {
  static get propTypes() {
    return {
      values: PropTypes.any,
      handleChange: PropTypes.func,
      nextStep: PropTypes.func,
      preStep: PropTypes.func,
    };
  }

  continue = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = (e) => {
    e.preventDefault();
    this.props.preStep();
  };

  render() {
    const { values, handleChange } = this.props;
    const btn = new BtnBootstrap();
    return (
      <>
        <div className="FormStyle d-flex align-items-center justify-content-center">
          <PageTitle title="台大分院雲林分院｜測驗用表單" />
          <Card className={`${styles.ExamQusetionCard}`}>
            <Card.Title className={styles.FormTitle}>
              <h1>
                <strong>台大醫院雲林分院 測驗用表單系統</strong>
              </h1>
            </Card.Title>

            <div>
              <h1>影片區域</h1>
            </div>
            <Card.Body>
              <Form.Label>
                <h2>
                  <strong>請填寫衛教測驗用影片問題</strong>
                </h2>
                <p>
                  <strong>若下列填寫問題為必答問題請點選○</strong>
                </p>
              </Form.Label>

              <InputGroup>
                <InputGroup.Radio aria-label="若此為必對問題請點選" />
                <Form.Floating>
                  <Form.Control
                    id="floatingInput"
                    type="text"
                    placeholder="請輸入問題"
                  />
                  <label htmlFor="floatingInput">請輸入問題</label>
                </Form.Floating>
                <FloatingLabel
                  controlId="floatingSelectGrid"
                  label="請選擇問答題目數"
                >
                  <Form.Select aria-label="Floating label select example">
                    <option>請點擊開啟選單</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </Form.Select>
                </FloatingLabel>

                {/* <button className="trashBtn">
                  <i className="bi bi-trash3">刪除</i>
                </button> */}

                <btn.Secondary Text={<i className="bi bi-trash3">刪除</i>} />
              </InputGroup>
              <Form.Label className="mt-3">
                <p>
                  <strong>若下列填寫問題為必答問題請點選○</strong>
                </p>
              </Form.Label>
              <InputGroup>
                {/* 編修中
                {values.map((choiceValue) => {
                  return <div></div>;
                })} */}
              </InputGroup>
              <div className="BtnDiv">
                <div className="QuestionBtnGroup">
                  <div className={`${styles.addQuestion}`}>
                    <btn.Success Text={"新增問題"} />
                  </div>
                  <div className={`${styles.delQuestion}`}>
                    <btn.Warning Text={"刪除問題"} />
                  </div>
                </div>

                <div className={`${styles.prestep}`}>
                  <btn.Danger Text={"上一步"} onClickEventName={this.back} />
                </div>
                <div className={`${styles.nextstep}`}>
                  <btn.PrimaryBtn Text={"預覽表單"} EventName={this.continue} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </>
    );
  }
}

export default InputVideoQuestion;
