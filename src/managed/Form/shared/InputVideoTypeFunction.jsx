import React from "react";
import PageTitle from "../../../components/Title";
import { Form, Card, FloatingLabel } from "react-bootstrap";
import {
  CardTitleFunction,
  CardSecondTitleFunction,
} from "./CardTitleFunction";
import BtnBootstrap from "../../../components/BtnBootstrap";
import styles from "../../../styles/Form/FormStyles.module.scss";

function InputVideoTypeFunction({
  FormMode = false,
  ChangeEvent = null,
  VideoType = 0,
  GoPrevEvent = null,
  GoNextEvent = null,
}) {
  return (
    <div className="FormStyle d-flex align-items-center justify-content-center">
      <PageTitle
        title={`台大分院雲林分院｜ ${FormMode ? "測驗用表單" : "練習用表單"}`}
      />
      <Card className={`${styles.ExamVideoTypeCard}`}>
        <Card.Title className={`${styles.FormTitle}`}>
          <CardTitleFunction TitleName={`台大醫院雲林分院`} />
          <CardTitleFunction
            TitleName={`${FormMode ? "測驗用" : "練習用"}表單系統`}
          />
        </Card.Title>
        <Card.Body>
          <Form.Label>
            <CardSecondTitleFunction
              TitleName={`請點選衛教${FormMode ? "測驗用" : "練習用"}影片類別`}
            />
          </Form.Label>
          <FloatingLabel controlId="floatingSelect" label="請選擇影片類別">
            <Form.Select
              name="videoFileLanguage"
              aria-label="Default select example"
              size="lg"
              onChange={ChangeEvent}
              defaultValue={VideoType}
              style={{
                paddingBottom: 0,
              }}
            >
              <option value={""}>請點擊開啟類別選單</option>
              <option value={1}>疾病照護</option>
              <option value={2}>活動</option>
              <option value={3}>進食</option>
              <option value={4}>管路照護及異常處理</option>
              <option value={5}>皮膚照護</option>
              <option value={6}>傷口照護</option>
              <option value={7}>預防合併症</option>
            </Form.Select>
          </FloatingLabel>
        </Card.Body>
        <Card.Footer>
          <BtnBootstrap
            btnPosition="ms-2"
            btnName="formStep"
            variant="danger"
            text={"上一步"}
            onClickEventName={GoPrevEvent}
          />
          <BtnBootstrap
            btnPosition="ms-2 float-end"
            btnName="formStep"
            variant="primary"
            text={"下一步"}
            onClickEventName={GoNextEvent}
            disabled={VideoType ? false : true}
          />
        </Card.Footer>
      </Card>
    </div>
  );
}

export default InputVideoTypeFunction;
