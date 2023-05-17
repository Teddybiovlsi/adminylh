import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { BoxArrowLeft } from "react-bootstrap-icons";
import { LinkContainer } from "react-router-bootstrap";
import styles from "../styles/components/NavStyle.module.scss";

export default function Header({ expand = "lg" }) {
  return (
    <Navbar
      collapseOnSelect
      id={styles.navBarContainer}
      expand={expand}
      className="mb-3"
      variant="dark"
      fixed="top"
    >
      <Container fluid>
        <LinkContainer to="/">
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
              <Nav.Link eventKey={2} href="#memes">
                <BoxArrowLeft title="登出" size={22} />
                登出
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
