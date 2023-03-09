import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { BoxArrowLeft } from "react-bootstrap-icons";
import { LinkContainer } from "react-router-bootstrap";
import styles from "../SCSS/NavStyle.module.scss";

function NavMenu() {
  return (
    <Navbar
      collapseOnSelect
      className={styles.navBarContainer}
      expand="lg"
      fixed="top"
      variant="dark"
    >
      <Container fluid>
        <LinkContainer to="/HomePage">
          <Navbar.Brand>台大分院雲林分院衛教系統</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
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
              <NavDropdown.Item>練習用</NavDropdown.Item>
              <LinkContainer to="/Exam">
                <NavDropdown.Item>測驗用</NavDropdown.Item>
              </LinkContainer>{" "}
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link>註冊後臺使用者</Nav.Link>

            <Nav.Link eventKey={2} href="#memes">
              <BoxArrowLeft title="登出" size={22} />
              登出
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavMenu;
