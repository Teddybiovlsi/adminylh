import React from "react";
import { AiFillSetting } from "react-icons/ai";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { clearAdminSession } from "./js/manageAction";
import styles from "../styles/components/NavStyle.module.scss";

export default function Header({ expand = "lg", admin }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminSession();
    navigate("/");
  };

  const userDropdownTitle = "使用者管理";
  const userDropdownId = "user-dropdown";
  const adminDropdownTitle = "後台使用者管理";
  const adminDropdownId = "admin-dropdown";
  const videoDropdownTitle = "建立影片表單";
  const videoDropdownId = "video-dropdown";
  const manageVideoDropdownTitle = "影片記錄管理";
  const manageVideoDropdownId = "manage-video-dropdown";

  const settingDropdownTitle = (
    <>
      設定
      <AiFillSetting />
    </>
  );
  const settingDropdownId = "setting-dropdown";

  return (
    <Navbar
      collapseOnSelect
      id={styles.navBarContainer}
      expand={expand}
      className="mb-3"
      variant="light"
      fixed="top"
    >
      <Container fluid>
        <LinkContainer to="/Home">
          <Navbar.Brand>台大醫院雲林分院衛教後臺管理系統</Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              主選單
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="me-auto">
              {admin !== null ? (
                <NavDropdown title={userDropdownTitle} id={userDropdownId}>
                  <LinkContainer to="/ManageClientAccount">
                    <NavDropdown.Item>帳號管理</NavDropdown.Item>
                  </LinkContainer>{" "}
                  <LinkContainer to="/ManagePraticeRecord">
                    <NavDropdown.Item>紀錄管理</NavDropdown.Item>
                  </LinkContainer>{" "}
                </NavDropdown>
              ) : null}
              {admin !== null ? (
                <NavDropdown title={adminDropdownTitle} id={adminDropdownId}>
                  <LinkContainer to="/ManageAdminAccount">
                    <NavDropdown.Item>帳號管理</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/Admin/Register">
                    <NavDropdown.Item>帳號註冊</NavDropdown.Item>
                  </LinkContainer>{" "}
                </NavDropdown>
              ) : null}
              {admin !== null ? (
                <NavDropdown title={videoDropdownTitle} id={videoDropdownId}>
                  <LinkContainer to="/Basic/Video">
                    <NavDropdown.Item>基本練習</NavDropdown.Item>
                  </LinkContainer>{" "}
                  <LinkContainer to="/Pratice">
                    <NavDropdown.Item>練習用</NavDropdown.Item>
                  </LinkContainer>{" "}
                  <LinkContainer to="/Exam">
                    <NavDropdown.Item>測驗用</NavDropdown.Item>
                  </LinkContainer>{" "}
                </NavDropdown>
              ) : null}
              {admin !== null ? (
                <NavDropdown
                  title={manageVideoDropdownTitle}
                  id={manageVideoDropdownId}
                >
                  <LinkContainer to="/Record/基礎練習">
                    <NavDropdown.Item>基本練習</NavDropdown.Item>
                  </LinkContainer>{" "}
                  <LinkContainer to="/Record/練習">
                    <NavDropdown.Item>練習用</NavDropdown.Item>
                  </LinkContainer>{" "}
                  <LinkContainer to="/Record/測驗">
                    <NavDropdown.Item>測驗用</NavDropdown.Item>
                  </LinkContainer>{" "}
                </NavDropdown>
              ) : null}
            </Nav>

            <Nav>
              <NavDropdown
                title={settingDropdownTitle}
                id={settingDropdownId}
                align={{ lg: "end" }}
              >
                {admin !== null ? (
                  <NavDropdown.Item as={"button"} onClick={handleLogout}>
                    登出
                  </NavDropdown.Item>
                ) : (
                  <LinkContainer to="/">
                    <NavDropdown.Item>登入</NavDropdown.Item>
                  </LinkContainer>
                )}
              </NavDropdown>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
