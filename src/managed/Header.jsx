import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
  Button,
} from "react-bootstrap";
import { BoxArrowLeft } from "react-bootstrap-icons";
import { LinkContainer } from "react-router-bootstrap";
import styles from "../styles/components/NavStyle.module.scss";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function Header({ expand = "lg" }) {
  const [user, setUser] = useState(JSON.parse(localStorage?.getItem("user")));
  // useEffect(() => {
  //   console.log("user", user);
  // }, [user]);

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
              Offcanvas
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="me-auto">
              <NavDropdown title="使用者管理" id="collasible-nav-dropdown">
                <LinkContainer to="/ManageClientAccount">
                  <NavDropdown.Item>帳號管理</NavDropdown.Item>
                </LinkContainer>{" "}
                <LinkContainer to="/ManagePraticeRecord">
                  <NavDropdown.Item>紀錄管理</NavDropdown.Item>
                </LinkContainer>{" "}
              </NavDropdown>
              <NavDropdown title="後台使用者管理" id="collasible-nav-dropdown">
                <LinkContainer to="/Admin/Register">
                  <NavDropdown.Item>註冊帳號</NavDropdown.Item>
                </LinkContainer>{" "}
                <LinkContainer to="/">
                  <NavDropdown.Item>管理帳號</NavDropdown.Item>
                </LinkContainer>{" "}
              </NavDropdown>
              <NavDropdown title="建立影片表單" id="collasible-nav-dropdown">
                <LinkContainer to="/Pratice">
                  <NavDropdown.Item>練習用</NavDropdown.Item>
                </LinkContainer>{" "}
                <LinkContainer to="/Exam">
                  <NavDropdown.Item>測驗用</NavDropdown.Item>
                </LinkContainer>{" "}
              </NavDropdown>
            </Nav>

            <Nav>
              {user !== null && (
                <div className="d-flex align-items-center justify-content-center me-2">
                  <p className="m-0 ">{`${user.name}你好`}</p>
                </div>
              )}
              {user !== null ? (
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    localStorage.removeItem("user");
                    setUser(null);
                  }}
                >
                  登出
                </Button>
              ) : (
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  登入
                </Button>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
