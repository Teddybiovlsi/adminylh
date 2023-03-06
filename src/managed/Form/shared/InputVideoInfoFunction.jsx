import React from "react";
import PageTitle from "../../../shared/Title";
import { Form, Card, FloatingLabel } from "react-bootstrap";
import CardTitleFunction from "./CardTitleFunction";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import styles from "./scss/FormStyles.module.scss";

function InputVideoInfoFunction({
  FormMode = false,
  ChangeEvent = null,
  VideoLanguage = "",
  GoPrevEvent = null,
  GoNextEvent = null,
}) {
  const btn = new BtnBootstrap();
  return (
    <div className="FormStyle d-flex align-items-center justify-content-center">
      <PageTitle title="台大分院雲林分院｜測驗用表單" />
      <PageTitle
        title={`台大分院雲林分院｜ ${FormMode ? "測驗用表單" : "練習用表單"}`}
      />
      <Card className={`${styles.ExamCard}`}>
        <Card.Title className={`${styles.FormTitle}`}>
          <CardTitleFunction
            TitleName={`台大醫院雲林分院 ${
              FormMode ? "測驗用" : "練習用"
            }表單系統`}
          />
        </Card.Title>
        <Card.Body>
          <Form.Label>
            <h2>
              <strong>
                請點選衛教{FormMode ? "測驗用" : "練習用"}影片語言
              </strong>
            </h2>
          </Form.Label>
          <FloatingLabel controlId="floatingSelect" label="請選擇影片語言">
            <Form.Select
              name="videoFileLanguage"
              aria-label="Default select example"
              size="lg"
              onChange={ChangeEvent}
              defaultValue={VideoLanguage}
              style={{
                paddingBottom: 0,
              }}
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
              <btn.Danger
                btnName={"formStep"}
                text={"上一步"}
                onClickEventName={GoPrevEvent}
              />
            </div>

            <div className={`${styles.nextstep}`}>
              <btn.PrimaryBtn
                btnName={"formStep"}
                text={"下一步"}
                onClickEventName={GoNextEvent}
                disabled={!VideoLanguage}
              />
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default InputVideoInfoFunction;
