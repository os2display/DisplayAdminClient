import { React } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Col from "react-bootstrap/Col";
import { useTranslation } from "react-i18next";
import NavItems from "../nav-items/nav-items";
import "./sidebar.scss";
/**
 * The sidebar component.
 *
 * @returns {object}
 *   The SideBar
 */
function SideBar() {
  const [t] = useTranslation("common");
  return (
    <Col className="bg-dark border-end d-none d-lg-block" lg={3} xl={2}>
      <Nav
        variant="dark"
        id="sidebar"
        className="sidebar-nav flex-column w-100 pb-3 sticky-md-top"
      >
        <Navbar.Brand
          href="/"
          className="text-white mb-2 mt-2 ms-3 d-none d-md-block"
        >
          {t("topbar.brand")}
        </Navbar.Brand>
        <NavItems />
      </Nav>
    </Col>
  );
}

export default SideBar;