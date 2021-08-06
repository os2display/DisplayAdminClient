import { React } from "react";
import Nav from "react-bootstrap/nav";
import Dropdown from "react-bootstrap/dropdown";
import Navbar from "react-bootstrap/navbar";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faPhotoVideo,
  faDesktop,
  faStream,
  faQuestionCircle,
  faUserCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import NavItems from "../nav-items/nav-items";
import SearchBox from "../../util/search-box/search-box";
import "./topbar.scss";
/**
 * The side bar component.
 *
 * @returns {object}
 *   The NavBar
 */
function TopBar() {
  const [t] = useTranslation("common");
  return (
    <Navbar
      variant="light"
      bg="white"
      expand="lg"
      className="border-bottom shadow-sm"
    >
      <Navbar.Brand href="/" className="col-lg-2 d-lg-none ms-3">
        {t("topbar.brand")}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-3" />
      <Navbar.Collapse id="basic-navbar-nav" className="px-3">
        {/* TODO: Global searchbox: results show as list in popover when typing more than 3 characters */}
        <div className="my-3 my-md-0">
          <SearchBox />
        </div>
        <Nav variant="dark" className="topbar-nav d-md-none">
          <NavItems />
        </Nav>
        <Nav className="ms-md-auto mt-3 mt-md-0">
          <Dropdown className="me-md-3 mb-2 mb-md-0">
            <Dropdown.Toggle variant="primary" id="topbar_add">
              <FontAwesomeIcon className="me-1" icon={faPlusCircle} />
              {t("topbar.add")}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Link
                id="nav-items_slides"
                className="dropdown-item"
                to="/slides"
              >
                <FontAwesomeIcon className="me-2" icon={faPhotoVideo} />
                {t("topbar.add_slide")}
              </Link>

              <Link
                id="nav-items_screens_screens"
                className="dropdown-item"
                to="/screens"
              >
                <FontAwesomeIcon className="me-2" icon={faDesktop} />
                {t("topbar.add_screen")}
              </Link>

              <Link
                id="nav-items_playlists_playlists"
                className="dropdown-item"
                to="/playlists"
              >
                <FontAwesomeIcon className="me-2" icon={faStream} />
                {t("topbar.add_playlist")}
              </Link>
            </Dropdown.Menu>
          </Dropdown>
          <Nav.Item className="me-md-3 mb-2 mb-md-0">
            <Link id="topbar-faq" className="btn btn-dark" to="/faq">
              <FontAwesomeIcon icon={faQuestionCircle} />
              <span className="visually-hidden">{t("topbar.faq")}</span>
            </Link>
          </Nav.Item>
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              id="topbar_user"
              className="text-dark text-decoration-none"
            >
              <FontAwesomeIcon
                className="me-1 fa-lg text-dark text-muted"
                icon={faUserCircle}
              />
              {t("topbar.user")}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Link id="topbar_signout" className="dropdown-item" to="/signout">
                <FontAwesomeIcon className="me-1" icon={faSignOutAlt} />
                {t("topbar.signout")}
              </Link>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default TopBar;
