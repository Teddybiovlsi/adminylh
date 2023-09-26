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
import styles from "../styles/components/NavStyle.module.scss";

export default function Header({ expand = "lg" }) {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage?.getItem("manage") || sessionStorage?.getItem("manage")
  );

  const handleLogout = () => {
    localStorage.getItem("manage") && localStorage.clear();
    sessionStorage.getItem("manage") && sessionStorage.clear();
    navigate("/");
  };

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
          <Navbar.Brand>台大分院雲林分院衛教系統</Navbar.Brand>
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
              {user !== null ? (
                <NavDropdown title="使用者管理" id="collasible-nav-dropdown">
                  <LinkContainer to="/ManageClientAccount">
                    <NavDropdown.Item>帳號管理</NavDropdown.Item>
                  </LinkContainer>{" "}
                  <LinkContainer to="/ManagePraticeRecord">
                    <NavDropdown.Item>紀錄管理</NavDropdown.Item>
                  </LinkContainer>{" "}
                </NavDropdown>
              ) : null}
              {user !== null ? (
                <NavDropdown
                  title="後台使用者管理"
                  id="collasible-nav-dropdown"
                >
                  <LinkContainer to="/Admin/Register">
                    <NavDropdown.Item>註冊帳號</NavDropdown.Item>
                  </LinkContainer>{" "}
                  <LinkContainer to="/">
                    <NavDropdown.Item>管理帳號</NavDropdown.Item>
                  </LinkContainer>{" "}
                </NavDropdown>
              ) : null}
              {user !== null ? (
                <NavDropdown title="建立影片表單" id="collasible-nav-dropdown">
                  <LinkContainer to="/Pratice">
                    <NavDropdown.Item>練習用</NavDropdown.Item>
                  </LinkContainer>{" "}
                  <LinkContainer to="/Exam">
                    <NavDropdown.Item>測驗用</NavDropdown.Item>
                  </LinkContainer>{" "}
                </NavDropdown>
              ) : null}
            </Nav>

            <Nav>
              <NavDropdown
                title={
                  <>
                    設定
                    <AiFillSetting />
                  </>
                }
                id="collasible-nav-dropdown"
                align={{ lg: "end" }}
              >
                {user !== null ? (
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
