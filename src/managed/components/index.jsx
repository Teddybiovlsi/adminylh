import React from "react";

import { Nav, NavLink } from "react-bootstrap";

const Navbar = () => {
    return (
        <>
            <Nav>
                <NavLink to="./AboutUs" activeStyle>
                    關於我們
                </NavLink>
                <NavLink to="./CreateExamVideoForm" activeStyle>
                    創建測驗用影片
                </NavLink>
            </Nav>
        </>
    );
};

export default Navbar;