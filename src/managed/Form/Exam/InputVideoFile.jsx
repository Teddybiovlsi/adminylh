import React, { Component } from "react";
import { Form } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import PageTitle from "../../../shared/Title";
import PropTypes from "prop-types";
import styles from "./FormStyles.module.scss";

export class InputVideoFile extends Component {
  static get propTypes() {
    return {
      values: PropTypes.any,
      handleClick: PropTypes.func,
      nextStep: PropTypes.func,
    };
  }

  continue = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  render() {
    const { values, handleClick } = this.props;
    const btn = new BtnBootstrap();

    return (
      <>
        <PageTitle title="台大分院雲林分院｜測驗用表單" />
        <div className="FormStyle d-flex align-items-center justify-content-center">
          <Card className={`${styles.ExamCard}`}>
            <Card.Title className={`${styles.FormTitle}`}>
              <h1>
                <strong>台大醫院雲林分院 測驗用表單系統</strong>
              </h1>
            </Card.Title>
            <Card.Body>
              <Form.Group controlId="formFile">
                <Form.Label>
                  <h2>
                    <strong>請匯入衛教測驗用影片</strong>
                  </h2>
                </Form.Label>

                <Form.Control
                  type="file"
                  accept="video/*"
                  onChange={handleClick("videoFile", "videoName")}
                  required
                />
                <Form.Label className="mt-3">
                  <h5>
                    {values.videoName && (
                      <strong>目前檔案為：{values.videoName}</strong>
                    )}
                  </h5>
                </Form.Label>
              </Form.Group>
              <div className={`${styles.nextstep}`}>
                <btn.PrimaryBtn
                  Text={"下一步"}
                  EventName={this.continue}
                  disabled={!values.videoName}
                />
              </div>
            </Card.Body>
          </Card>
        </div>
      </>
    );
  }
}
export default InputVideoFile;
