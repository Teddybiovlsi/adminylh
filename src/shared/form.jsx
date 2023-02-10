import React from "react";
import { useState } from "react";
import "./form.css";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginForm = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogin, setkeepLogin] = useState(1);

  return (
    <form className="loginForm">
      <div className="inputText">
        <input
          type="text"
          placeholder="帳號  Account"
          value={account}
          onChange={(e) => {
            return setAccount(e.target.value);
          }}
          required
        />
      </div>
      <div className="inputText">
        {/* <label>密碼：</label> */}
        <input
          type="password"
          placeholder="密碼  Password"
          value={password}
          onChange={(e) => {
            return setPassword(e.target.value);
          }}
          required
        />
      </div>
      <div className="BtnContainter">
        <div className="switch_toggle">
          <label className="switch">
            <input
              type="checkbox"
              name="keepLogin"
              value={keepLogin}
              onChange={(e) => {
                return setkeepLogin(e.target.value);
              }}
            />
            <span className="slider round"></span>
          </label>
          <p id="keepLoginText">保持登入</p>
        </div>
        <div className="loginBtnContainer">
          <button id="loginBtn" type="submit">
            登入
          </button>
        </div>
      </div>
    </form>
  );
};

const CreateVideoForm = () => {
  return (
    <>
      <Form.Group controlId="formFile" className="w-50 mb-3">
        <Form.Label>
          <h3>
            <strong>請匯入衛教測驗用影片</strong>
          </h3>
        </Form.Label>
        <Form.Control type="file" />
      </Form.Group>
    </>
  );
};

const SelectFormLanguage = () => {
  return (
    <>
      <h3>
        <strong>請選擇測驗用影片語言</strong>
      </h3>
      <Form.Select aria-label="請輸入測驗用影片語系">
        <option>請點選開啟測驗用語系選單</option>
        <option value=""></option>
        <option value="">國語</option>
        <option value="">台語</option>
        <option value="">英文</option>
        <option value="">日文</option>
        <option value="">越南文</option>
        <option value="">泰文</option>
        <option value="">印尼語</option>
        <option value="">菲律賓語</option>
      </Form.Select>
    </>
  );
};

const InputFormQuestionNum = () => {
  return (
    <>
      <Form.Label htmlFor="inputPassword5">
        <h3>
          <strong>請輸入測驗用影片題目數</strong>
        </h3>
      </Form.Label>
      <Form.Control
        type="number"
        id="inputPassword5"
        aria-describedby="passwordHelpBlock"
      />
      <Form.Text id="passwordHelpBlock" muted>
        Your password must be 8-20 characters long, contain letters and numbers,
        and must not contain spaces, special characters, or emoji.
      </Form.Text>
    </>
  );
};

export { LoginForm, CreateVideoForm, SelectFormLanguage, InputFormQuestionNum };
// export { LoginForm, CreateVideoForm, SelectFormLanguage, InputFormQuestionNum };
