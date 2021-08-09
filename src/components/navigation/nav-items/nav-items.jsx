import { React } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faTachometerAlt,
  faDesktop,
  faStream,
  faPhotoVideo,
  faPlusCircle,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import "./nav-items.scss";
/**
 * The nav items.
 *
 * @returns {object}
 *   nav items
 */
function NavItems() {
  const [t] = useTranslation("common");
  return (
    <>
      {/* TODO: Dashboard is hidden for now */}
      {/* <Nav.Item>
        <Link id="navbar_dashboard" className="nav-link" to="/dashboard">
          <FontAwesomeIcon className="me-2" icon={faTachometerAlt} />
          {t("nav-items.dashboard")}
        </Link>
      </Nav.Item>
      <hr className="d-none d-md-block" /> */}

      {/* TODO: Show active item based on Route */}
      <Nav.Item className="d-flex justify-content-between active">
        <Link
          id="nav-items_content_slides"
          className="nav-link d-inline w-100"
          to="/slides"
        >
          <FontAwesomeIcon className="me-2" icon={faPhotoVideo} />
          {t("nav-items.content-slides")}
        </Link>
        <Link className="nav-link d-inline nav-add-new" to="/slides/new">
          <FontAwesomeIcon className="ms-3" icon={faPlusCircle} />
        </Link>
      </Nav.Item>
      <Nav.Item className="nav-second-level">
        <Link id="nav-items_content_tags" className="nav-link" to="/tags">
          {t("nav-items.content-tags")}
        </Link>
      </Nav.Item>
      <Nav.Item className="nav-second-level">
        <Link
          id="nav-items_content_media"
          className="nav-link"
          to="/media-list"
        >
          {t("nav-items.content-media")}
        </Link>
      </Nav.Item>
      <Nav.Item className="d-flex justify-content-between">
        <Link
          id="nav-items_playlists_playlists"
          className="nav-link d-inline"
          to="/playlists"
        >
          <FontAwesomeIcon className="me-2" icon={faStream} />
          {t("nav-items.playlists-playlists")}
        </Link>
        <Link className="nav-link d-inline nav-add-new" to="/screens/new">
          <FontAwesomeIcon className="ms-3" icon={faPlusCircle} />
        </Link>
      </Nav.Item>
      <Nav.Item className="nav-second-level">
        <Link
          id="nav-items_playlists_categories"
          className="nav-link"
          to="/categories"
        >
          {t("nav-items.playlists-categories")}
        </Link>
      </Nav.Item>
      <Nav.Item className="d-flex justify-content-between">
        <Link
          id="nav-items_screens_screens"
          className="nav-link d-inline"
          to="/screens"
        >
          <FontAwesomeIcon className="me-2" icon={faDesktop} />
          {t("nav-items.screens-screens")}
        </Link>
        <Link className="nav-link d-inline nav-add-new" to="/screens/new">
          <FontAwesomeIcon className="ms-3" icon={faPlusCircle} />
        </Link>
      </Nav.Item>
      <Nav.Item className="nav-second-level">
        <Link id="nav-items_screens_groups" className="nav-link" to="/groups">
          {t("nav-items.screens-groups")}
        </Link>
      </Nav.Item>
      <Nav.Item className="nav-second-level">
        <Link
          id="nav-items_screens_locations"
          className="nav-link"
          to="/locations"
        >
          {t("nav-items.screens-locations")}
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link id="nav-items_settings" className="nav-link" to="/settings">
          <FontAwesomeIcon className="me-2" icon={faCog} />
          {t("nav-items.settings")}
        </Link>
      </Nav.Item>
      <Nav.Item className="nav-second-level">
        <Link
          id="navbar_configuration_themes"
          className="nav-link"
          to="/themes"
        >
          {t("navbar.configuration-themes")}
        </Link>
      </Nav.Item>
      <Nav.Item className="nav-second-level">
        <Link id="navbar_configuration_users" className="nav-link" to="/users">
          {t("navbar.configuration-users")}
        </Link>
      </Nav.Item>
    </>
  );
}

export default NavItems;