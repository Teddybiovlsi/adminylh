import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { BoxArrowLeft } from "react-bootstrap-icons";
import { LinkContainer } from "react-router-bootstrap";
import styles from "../SCSS/NavStyle.module.scss";

function NavMenu({ expand = "lg" }) {
  return (
    <Navbar
      collapseOnSelect
      className={styles.navBarContainer}
      expand={expand}
      fixed="top"
      variant="dark"
    >
      <Container fluid>
        <LinkContainer to="/HomePage">
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
                <LinkContainer to="/ManageAccount">
                  <NavDropdown.Item>帳號管理</NavDropdown.Item>
                </LinkContainer>{" "}
                <LinkContainer to="/ManagePraticeRecord">
                  <NavDropdown.Item>紀錄管理</NavDropdown.Item>
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
              <LinkContainer to="/Register">
                <Nav.Link>註冊後臺使用者</Nav.Link>
              </LinkContainer>
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

export default NavMenu;
