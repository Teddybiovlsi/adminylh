import React, { Component } from "react";
import PageTitle from "../../../shared/Title";
import PropTypes from "prop-types";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Form, Card } from "react-bootstrap";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import styles from "./FormStyles.module.scss";

class EditVideoInfo extends Component {
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
          <Card className={`${styles.ExamCard}`}>
            <Card.Title className={`${styles.FormTitle}`}>
              <h1>
                <strong>台大醫院雲林分院 測驗用表單系統</strong>
              </h1>
            </Card.Title>
            <Card.Body>
              <Form.Label>
                <h2>
                  <strong>請點選衛教測驗用影片語言</strong>
                </h2>
              </Form.Label>
              <FloatingLabel controlId="floatingSelect" label="請選擇影片語言">
                <Form.Select
                  name="videoFileLanguage"
                  aria-label="Default select example"
                  size="lg"
                  onChange={handleChange("videoLanguage")}
                  defaultValue={values.videoLanguage}
                >
                  <option>請點擊開啟語言選單</option>
                  <option value="1">國語</option>
                  <option value="2">台語</option>
                  <option value="3">英文</option>
                  <option value="4">日文</option>
                  <option value="5">越南文</option>
                  <option value="6">泰文</option>
                  <option value="7">印尼語</option>
                  <option value="8">菲律賓語</option>
                </Form.Select>
              </FloatingLabel>
              <div className="BtnDiv">
                <div className={`${styles.prestep}`}>
                  <btn.Danger text={"上一步"} onClickEventName={this.back} />
                </div>

                <div className={`${styles.nextstep}`}>
                  <btn.PrimaryBtn
                    text={"下一步"}
                    eventName={this.continue}
                    disabled={!values.videoLanguage}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </>
    );
  }
}

export default EditVideoInfo;
