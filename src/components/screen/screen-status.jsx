import dayjs from "dayjs";
import PropTypes from "prop-types";
import { React, JSX, useState, useEffect } from "react";
import { Alert, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import idFromUrl from "../util/helpers/id-from-url";
import { api } from "../../redux/api/api.generated.ts";
import { displayError } from "../util/list/toast-component/display-toast";
import FormInput from "../util/forms/form-input";
import ConfigLoader from "../../config-loader";

/**
 * Displays screen status.
 *
 * @param {object} props The props.
 * @param {object} props.screen The screen.
 * @param {string | null} props.mode The display mode: 'default' or 'minimal'
 * @param {Function} props.handleInput Handler for change in input.
 * @returns {JSX.Element} The status element.
 */
function ScreenStatus({ screen, handleInput = () => {}, mode = "default" }) {
  const { t } = useTranslation("common", { keyPrefix: "screen-status" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [clientRelease, setClientRelease] = useState(null);
  const [bindKey, setBindKey] = useState("");
  const [showScreenStatus, setShowScreenStatus] = useState(false);

  const { status } = screen;

  const handleBindScreen = () => {
    if (bindKey) {
      dispatch(
        api.endpoints.postScreenBindKey.initiate({
          id: idFromUrl(screen["@id"]),
          screenBindObject: JSON.stringify({
            bindKey,
          }),
        })
      ).then((response) => {
        if (response.error) {
          const err = response.error;
          displayError(
            t("error-messages.error-binding", {
              status: err.status,
            }),
            err
          );
        } else {
          // Set screenUser to true, to indicate it has been set.
          handleInput({ target: { id: "screenUser", value: true } });
        }
      });
    }
  };

  const handleUnbindScreen = () => {
    if (screen?.screenUser) {
      setBindKey("");

      dispatch(
        api.endpoints.postScreenUnbind.initiate({
          id: idFromUrl(screen["@id"]),
        })
      ).then((response) => {
        if (response.error) {
          const err = response.error;
          displayError(
            t("error-messages.error-unbinding", {
              status: err.status,
            }),
            err
          );
        } else {
          // Set screenUser and status to null, to indicate it has been removed.
          handleInput({ target: { id: "screenUser", value: null } });
        }
      });
    }
  };

  useEffect(() => {
    if (status) {
      const now = dayjs().startOf("minute").valueOf();

      if (status?.clientMeta?.host) {
        fetch(`${status.clientMeta.host}/release.json?ts=${now}`)
          .then((res) => res.json())
          .then((data) => setClientRelease(data));
      }
    }
  }, [status]);

  useEffect(() => {
    ConfigLoader.loadConfig().then((config) => {
      setShowScreenStatus(config.showScreenStatus);
    });
  }, []);

  if (mode === "minimal") {
    if (!status) {
      return (
        <Button
          variant="outline-primary"
          type="button"
          onClick={() => navigate(`/screen/edit/${idFromUrl(screen["@id"])}`)}
          className="margin-right-button"
          size="sm"
        >
          <FontAwesomeIcon icon={faPlus} /> {t("connect")}
        </Button>
      );
    }

    const latestRequest = dayjs(status.latestRequestDateTime);
    const inOneHour = dayjs().add(1, "hours");

    if (status?.clientMeta?.tokenExpired || latestRequest > inOneHour) {
      return (
        <FontAwesomeIcon icon={faExclamationCircle} className="text-danger" />
      );
    }

    if (clientRelease) {
      if (status?.releaseVersion !== clientRelease?.releaseVersion) {
        return <FontAwesomeIcon icon={faInfoCircle} className="text-warning" />;
      }

      if (status?.releaseTimestamp !== clientRelease?.releaseTimestamp) {
        return <FontAwesomeIcon icon={faInfoCircle} className="text-warning" />;
      }
    }

    return (
      <div>
        <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
      </div>
    );
  }

  const getStatusAlert = () => {
    let message = t("already-bound");
    let variant = "success";
    let icon = <FontAwesomeIcon icon={faCheck} />;
    const screenBound = !!screen.screenUser;
    const notRunningLatestRelease =
      status &&
      (clientRelease?.releaseTimestamp !== status?.releaseTimestamp ||
        clientRelease?.releaseVersion !== status?.releaseVersion);

    if (!screenBound) {
      message = t("not-bound");
      variant = "danger";
    } else if (status?.clientMeta?.tokenExpired) {
      message = t("token-expired");
      variant = "danger";
    } else if (
      status &&
      dayjs(status?.latestRequestDateTime) < dayjs().subtract(1, "hour")
    ) {
      message = t("latest-request-warning");
      variant = "danger";
      icon = <FontAwesomeIcon icon={faExclamationTriangle} />;
    } else if (notRunningLatestRelease) {
      message = t("release-warning");
      variant = "warning";
      icon = <FontAwesomeIcon icon={faInfoCircle} />;
    }

    return (
      <Alert variant={variant} className="mb-3">
        <div className="mb-3">
          {icon}
          {"  "}
          {message}
        </div>

        {!screenBound && (
          <>
            <FormInput
              onChange={({ target }) => {
                setBindKey(target?.value);
              }}
              name="bindKey"
              value={bindKey}
              label={t("bindkey-label")}
              className="mb-3"
            />
            <Button onClick={handleBindScreen}>{t("bind")}</Button>
          </>
        )}

        {screenBound && (
          <>
            {showScreenStatus && (
              <ul>
                {status?.latestRequestDateTime && (
                  <li>
                    {t("latest-request")}:{" "}
                    {dayjs(status?.latestRequestDateTime).format(
                      "D/M YYYY HH:mm"
                    )}
                  </li>
                )}
                {status?.releaseVersion && (
                  <li>
                    {t("release-version")}: {status?.releaseVersion}
                    {notRunningLatestRelease && (
                      <>
                        {" "}
                        ({t("newest")}: {clientRelease?.releaseVersion})
                      </>
                    )}
                  </li>
                )}
                {status?.releaseTimestamp && (
                  <li>
                    {t("release-timestamp")}:{" "}
                    {dayjs(status?.releaseTimestamp * 1000).format(
                      "D/M YYYY HH:mm"
                    )}
                    {notRunningLatestRelease && (
                      <>
                        {"  "}({t("newest")}:{" "}
                        {clientRelease?.releaseTimestamp &&
                          dayjs(clientRelease?.releaseTimestamp * 1000).format(
                            "D/M YYYY HH:mm"
                          )}
                        )
                      </>
                    )}
                  </li>
                )}
              </ul>
            )}

            <Button onClick={handleUnbindScreen} className="mt-3">
              {t("unbind")}
            </Button>
          </>
        )}
      </Alert>
    );
  };

  return <>{getStatusAlert()}</>;
}

ScreenStatus.propTypes = {
  screen: PropTypes.shape({
    "@id": PropTypes.string.isRequired,
    screenUser: PropTypes.string,
    status: PropTypes.shape({
      releaseVersion: PropTypes.string,
      releaseTimestamp: PropTypes.number,
      latestRequestDateTime: PropTypes.string,
      clientMeta: PropTypes.shape({
        ip: PropTypes.string,
        host: PropTypes.string,
        userAgent: PropTypes.string,
        tokenExpired: PropTypes.bool,
      }),
    }),
  }).isRequired,
  mode: PropTypes.string,
  handleInput: PropTypes.func,
};

export default ScreenStatus;
