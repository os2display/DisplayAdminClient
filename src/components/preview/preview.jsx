import { React, JSX, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import LocalStorageKeys from "../util/local-storage-keys";
import ConfigLoader from "../../config-loader";

/**
 * The preview component.
 *
 * @param {object} props The props.
 * @param {string} props.id The id to preview.
 * @param {string} props.mode The mode: screen, playlist, slide
 * @param {number} props.width The width of the container.
 * @param {number} props.height The height of the container.
 * @param {number} props.simulatedWidth The width of the screen to simulate.
 * @param {number} props.simulatedHeight The height of the screen to simulate.
 * @returns {JSX.Element} The preview component
 */
function Preview({
  id,
  mode,
  width = 960,
  height = 540,
  simulatedWidth = 1920,
  simulatedHeight = 1080,
}) {
  const { t } = useTranslation("common", { keyPrefix: "preview" });
  const [previewClientUrl, setPreviewClientUrl] = useState(null);

  useEffect(() => {
    ConfigLoader.loadConfig().then((config) => {
      const base = config.previewClient ?? "";

      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set("preview", mode);
      urlSearchParams.set("preview-id", id);
      urlSearchParams.set(
        "preview-token",
        localStorage.getItem(LocalStorageKeys.API_TOKEN)
      );
      const tenantEntry = localStorage.getItem(
        LocalStorageKeys.SELECTED_TENANT
      );
      urlSearchParams.set("preview-tenant", JSON.parse(tenantEntry).tenantKey);

      setPreviewClientUrl(`${base}?${urlSearchParams}`);
    });
  }, []);

  const scale = width / simulatedWidth;

  return (
    <>
      {typeof previewClientUrl === "string" && (
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            overflow: "hidden",
          }}
        >
          <iframe
            title={t("preview-title")}
            src={previewClientUrl}
            style={{
              transform: `scale(${scale})`,
              height: `${simulatedHeight}px`,
              width: `${simulatedWidth}px`,
              left: 0,
              transformOrigin: "0 0",
            }}
          />
        </div>
      )}
    </>
  );
}

Preview.propTypes = {
  id: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  simulatedWidth: PropTypes.number,
  simulatedHeight: PropTypes.number,
};

export default Preview;
