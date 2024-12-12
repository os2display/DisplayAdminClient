import { React, useEffect, useState, Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import { Routes, Route, Navigate } from "react-router-dom";
import i18next from "i18next";
import { ToastContainer } from "react-toastify";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import localStorageKeys from "./components/util/local-storage-keys";
import RestrictedRoute from "./restricted-route";
import Topbar from "./components/navigation/topbar/top-bar";
import SideBar from "./components/navigation/sidebar/sidebar";
import ScreenList from "./components/screen/screen-list";
import SlidesList from "./components/slide/slides-list";
import GroupsList from "./components/groups/groups-list";
import GroupCreate from "./components/groups/group-create";
import GroupEdit from "./components/groups/group-edit";
import PlaylistCampaignList from "./components/playlist/playlist-campaign-list";
import PlaylistCampaignEdit from "./components/playlist/playlist-campaign-edit";
import PlaylistCampaignCreate from "./components/playlist/playlist-campaign-create";
import MediaList from "./components/media/media-list";
import commonDa from "./translations/da/common.json";
import ScreenCreate from "./components/screen/screen-create";
import ScreenEdit from "./components/screen/screen-edit";
import SlideEdit from "./components/slide/slide-edit";
import SlideCreate from "./components/slide/slide-create";
import MediaCreate from "./components/media/media-create";
import ThemesList from "./components/themes/themes-list";
import ThemeCreate from "./components/themes/theme-create";
import ThemeEdit from "./components/themes/theme-edit";
import UserContext from "./context/user-context";
import ListContext from "./context/list-context";
import SharedPlaylists from "./components/playlist/shared-playlists";
import Logout from "./components/user/logout";
import AuthHandler from "./auth-handler";
import LoadingComponent from "./components/util/loading-component/loading-component";
import ModalProvider from "./context/modal-context/modal-provider";
import UsersList from "./components/users/users-list";
import ActivationCodeList from "./components/activation-code/activation-code-list";
import ActivationCodeCreate from "./components/activation-code/activation-code-create";
import ActivationCodeActivate from "./components/activation-code/activation-code-activate";
import ConfigLoader from "./config-loader";
import "react-toastify/dist/ReactToastify.css";
import "./app.scss";
import FeedSourcesList from "./components/feed-sources/feed-sources-list";
import FeedSourceCreate from "./components/feed-sources/feed-source-create";
import FeedSourceEdit from "./components/feed-sources/feed-source-edit";

/**
 * App component.
 *
 * @returns {object} The component.
 */
function App() {
  const [authenticated, setAuthenticated] = useState();
  const [config, setConfig] = useState();
  const [selectedTenant, setSelectedTenant] = useState();
  const [accessConfig, setAccessConfig] = useState();
  const [tenants, setTenants] = useState();
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [createdBy, setCreatedBy] = useState("all");
  const [isPublished, setIsPublished] = useState("all");
  const [exists, setExists] = useState(null);
  const [screenUserLatestRequest, setScreenUserLatestRequest] = useState(null);

  const userStore = {
    authenticated: { get: authenticated, set: setAuthenticated },
    accessConfig: { get: accessConfig, set: setAccessConfig },
    config,
    tenants: { get: tenants, set: setTenants },
    selectedTenant: { get: selectedTenant, set: setSelectedTenant },
    userName: { get: userName, set: setUserName },
    userType: { get: userType, set: setUserType },
    email: { get: email, set: setEmail },
  };
  const listConfig = {
    searchText: { get: searchText, set: setSearchText },
    page: { get: page, set: setPage },
    createdBy: { get: createdBy, set: setCreatedBy },
    isPublished: { get: isPublished, set: setIsPublished },
    exists: { get: exists, set: setExists },
    screenUserLatestRequest: {
      get: screenUserLatestRequest,
      set: setScreenUserLatestRequest,
    },
  };

  useEffect(() => {
    ConfigLoader.loadConfig().then((loadedConfig) => {
      setConfig(loadedConfig);
    });
  }, []);

  const handleReauthenticate = () => {
    localStorage.removeItem(localStorageKeys.API_TOKEN);
    localStorage.removeItem(localStorageKeys.API_REFRESH_TOKEN);
    localStorage.removeItem(localStorageKeys.SELECTED_TENANT);
    localStorage.removeItem(localStorageKeys.TENANTS);
    localStorage.removeItem(localStorageKeys.USER_NAME);
    localStorage.removeItem(localStorageKeys.EMAIL);
    localStorage.removeItem(localStorageKeys.USER_TYPE);

    setSelectedTenant(null);
    setTenants(null);
    setUserName("");
    setEmail("");
    setUserType("");
    setAuthenticated(false);
  };

  // Check that authentication token exists.
  useEffect(() => {
    const token = localStorage.getItem(localStorageKeys.API_TOKEN);

    if (token !== null) {
      setAuthenticated(true);

      // If there is a selected tenant, fetch from local storage and use
      if (localStorage.getItem(localStorageKeys.SELECTED_TENANT)) {
        setSelectedTenant(
          JSON.parse(localStorage.getItem(localStorageKeys.SELECTED_TENANT))
        );
      }

      // Fetch the users tenants from local storage and use
      if (localStorage.getItem(localStorageKeys.TENANTS)) {
        setTenants(JSON.parse(localStorage.getItem(localStorageKeys.TENANTS)));
      }

      // Get the user name for displaying in top bar.
      setUserName(localStorage.getItem(localStorageKeys.USER_NAME));

      // Get the user email for displaying in top bar.
      setEmail(localStorage.getItem(localStorageKeys.EMAIL));

      // Set the user type from local storage.
      setUserType(localStorage.getItem(localStorageKeys.USER_TYPE));
    } else {
      setAuthenticated(false);
    }

    document.addEventListener("reauthenticate", handleReauthenticate);

    return () => {
      document.removeEventListener("reauthenticate", handleReauthenticate);
    };
  }, []);

  useEffect(() => {
    fetch("/admin/access-config.json")
      .then((response) => response.json())
      .then((jsonData) => {
        setAccessConfig(jsonData);
      })
      .catch(() => {
        setAccessConfig({
          campaign: {
            roles: ["ROLE_ADMIN"],
          },
          screen: {
            roles: ["ROLE_ADMIN"],
          },
          settings: {
            roles: ["ROLE_ADMIN"],
          },
          groups: {
            roles: ["ROLE_ADMIN"],
          },
          shared: {
            roles: ["ROLE_ADMIN"],
          },
          users: {
            roles: ["ROLE_ADMIN", "ROLE_EXTERNAL_USER_ADMIN"],
          },
        });
      });
  }, []);

  useEffect(() => {
    i18next.init({
      interpolation: { escapeValue: false }, // React already does escaping
      lng: "da", // language to use
      keySeparator: ".",
      resources: {
        da: {
          common: commonDa,
        },
      },
    });
  }, []);

  return (
    <>
      <UserContext.Provider value={userStore}>
        <I18nextProvider i18n={i18next}>
          <ModalProvider>
            <Suspense
              fallback={
                <LoadingComponent isLoading loadingMessage="Vent venligst" />
              }
            >
              <ToastContainer
                autoClose="10000"
                position="bottom-right"
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                progress={undefined}
              />
              <AuthHandler>
                <Container fluid className="h-100 px-0 bg-light">
                  <Row className="row-full-height g-0">
                    <SideBar />
                    <ListContext.Provider value={listConfig}>
                      <Col lg={9} xl={10}>
                        <Topbar />
                        {accessConfig && (
                          <main className="col p-3">
                            <Routes>
                              <Route path="campaign">
                                <Route
                                  path="create"
                                  element={
                                    <RestrictedRoute
                                      roles={accessConfig.campaign.roles}
                                    >
                                      <PlaylistCampaignCreate location="campaign" />
                                    </RestrictedRoute>
                                  }
                                />
                                <Route
                                  path="edit/:id"
                                  element={
                                    <RestrictedRoute
                                      roles={accessConfig.campaign.roles}
                                    >
                                      <PlaylistCampaignEdit location="campaign" />
                                    </RestrictedRoute>
                                  }
                                />
                                <Route
                                  path="list"
                                  element={
                                    <RestrictedRoute
                                      roles={accessConfig.campaign.roles}
                                    >
                                      <PlaylistCampaignList location="campaign" />
                                    </RestrictedRoute>
                                  }
                                />
                              </Route>
                              <Route path="playlist">
                                <Route
                                  path="create"
                                  element={
                                    <PlaylistCampaignCreate location="playlist" />
                                  }
                                />
                                <Route
                                  path="edit/:id"
                                  element={
                                    <PlaylistCampaignEdit location="playlist" />
                                  }
                                />
                                <Route
                                  path="list"
                                  element={
                                    <PlaylistCampaignList location="playlist" />
                                  }
                                />
                              </Route>
                              <Route path="shared">
                                <Route
                                  path="list"
                                  element={
                                    <RestrictedRoute
                                      roles={accessConfig.shared.roles}
                                    >
                                      <SharedPlaylists />
                                    </RestrictedRoute>
                                  }
                                />
                              </Route>
                              <Route path="screen">
                                <Route
                                  path="list"
                                  element={
                                    <RestrictedRoute
                                      roles={accessConfig.screen.roles}
                                    >
                                      <ScreenList />
                                    </RestrictedRoute>
                                  }
                                />
                                <Route
                                  path="create"
                                  element={
                                    <RestrictedRoute
                                      roles={accessConfig.screen.roles}
                                    >
                                      <ScreenCreate />
                                    </RestrictedRoute>
                                  }
                                />
                                <Route
                                  path="edit/:id"
                                  element={
                                    <RestrictedRoute
                                      roles={accessConfig.screen.roles}
                                    >
                                      <ScreenEdit />
                                    </RestrictedRoute>
                                  }
                                />
                              </Route>
                              <Route path="group">
                                <Route
                                  path="list"
                                  element={
                                    <RestrictedRoute
                                      roles={accessConfig.groups.roles}
                                    >
                                      <GroupsList />
                                    </RestrictedRoute>
                                  }
                                />
                                <Route
                                  path="edit/:id"
                                  element={
                                    <RestrictedRoute
                                      roles={accessConfig.groups.roles}
                                    >
                                      <GroupEdit />
                                    </RestrictedRoute>
                                  }
                                />
                                <Route
                                  path="create"
                                  element={
                                    <RestrictedRoute
                                      roles={accessConfig.groups.roles}
                                    >
                                      <GroupCreate />
                                    </RestrictedRoute>
                                  }
                                />
                              </Route>
                              <Route path="slide">
                                <Route path="list" element={<SlidesList />} />
                                <Route
                                  path="create"
                                  element={<SlideCreate />}
                                />
                                <Route
                                  path="edit/:id"
                                  element={<SlideEdit />}
                                />
                              </Route>
                              <Route path="media">
                                <Route path="list" element={<MediaList />} />
                                <Route
                                  path="create"
                                  element={<MediaCreate />}
                                />
                              </Route>
                              <Route path="activation">
                                <Route
                                  path="list"
                                  element={<ActivationCodeList />}
                                />
                                <Route
                                  path="create"
                                  element={<ActivationCodeCreate />}
                                />
                                <Route
                                  path="activate"
                                  element={<ActivationCodeActivate />}
                                />
                              </Route>
                              <Route path="users">
                                <Route path="list" element={<UsersList />} />
                              </Route>
                              <Route path="themes">
                                <Route
                                  path="list"
                                  element={
                                    <RestrictedRoute
                                      roles={accessConfig.settings.roles}
                                    >
                                      <ThemesList />
                                    </RestrictedRoute>
                                  }
                                />
                                <Route
                                  path="edit/:id"
                                  element={
                                    <RestrictedRoute
                                      roles={accessConfig.settings.roles}
                                    >
                                      <ThemeEdit />
                                    </RestrictedRoute>
                                  }
                                />
                                <Route
                                  path="create"
                                  element={
                                    <RestrictedRoute
                                      roles={accessConfig.settings.roles}
                                    >
                                      <ThemeCreate />
                                    </RestrictedRoute>
                                  }
                                />
                              </Route>
                              <Route path="feed-sources">
                                <Route
                                  path="list"
                                  element={
                                    <RestrictedRoute
                                      roles={accessConfig.settings.roles}
                                    >
                                      <FeedSourcesList />
                                    </RestrictedRoute>
                                  }
                                />
                                <Route
                                  path="create"
                                  element={
                                    <RestrictedRoute
                                      roles={accessConfig.settings.roles}
                                    >
                                      <FeedSourceCreate />
                                    </RestrictedRoute>
                                  }
                                />
                                <Route
                                  path="edit/:id"
                                  element={
                                    <RestrictedRoute
                                      roles={accessConfig.settings.roles}
                                    >
                                      <FeedSourceEdit />
                                    </RestrictedRoute>
                                  }
                                />
                              </Route>
                              <Route path="logout" element={<Logout />} />
                              <Route
                                path="*"
                                element={<Navigate to="/slide/list" />}
                              />
                            </Routes>
                          </main>
                        )}
                      </Col>
                    </ListContext.Provider>
                  </Row>
                </Container>
              </AuthHandler>
            </Suspense>
          </ModalProvider>
        </I18nextProvider>
      </UserContext.Provider>
    </>
  );
}

export default App;
