import { React, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useRemoteComponent } from "./remote-component-helper";
import ErrorBoundary from "../../../error-boundary";
import "./remote-component-wrapper.scss";

/**
 * A remote component wrapper
 *
 * @param {object} props Props.
 * @param {object} props.slide The slide.
 * @param {boolean} props.url The url for the remote component.
 * @param {object} props.mediaData Object of loaded media.
 * @param {object} props.themeData Object of theme data.
 * @param {string} props.orientation Display orientation or horizontal.
 * @param {boolean} props.showPreview Whether to display the preview.
 * @param {boolean} props.closeButton Display close button on preview
 * @param {Function} props.closeCallback Close button callback on preview
 * @param {boolean} props.adjustFontSize Adjust the font size compared to size in full hd.
 * @returns {object} The component.
 */
function RemoteComponentWrapper({
  slide,
  url,
  showPreview,
  orientation = "",
  closeButton = false,
  closeCallback = () => {},
  mediaData = null,
  themeData = {},
  adjustFontSize = true,
}) {
  const { t } = useTranslation("common");
  const [remoteComponentSlide, setRemoteComponentSlide] = useState(null);
  const [loading, err, Component] = useRemoteComponent(url);
  const [runId, setRunId] = useState("");
  const [fontSizeEm, setFontSizeEm] = useState(1);

  /** Create remoteComponentSlide from slide and mediaData */
  useEffect(() => {
    if (slide) {
      // Local slide and local content, to not accidentally mess with the actual content.
      const newSlide = { ...slide };

      if (mediaData) {
        newSlide.mediaData = mediaData;

        // Map temp images, so they are visible in preview before save
        const mediaDataCopy = { ...mediaData };

        // Find tempid keys
        const keys = Object.keys(mediaDataCopy).filter((key) =>
          key.includes("TEMP")
        );

        // Create "fake" url to file
        keys.forEach((key) => {
          mediaDataCopy[key] = {
            assets: { uri: URL.createObjectURL(mediaDataCopy[key].file) },
          };
        });

        newSlide.mediaData = mediaDataCopy;
      }

      newSlide.theme = themeData;

      // Load theme logo.
      if (newSlide?.themeData?.logo) {
        const { logo } = newSlide.themeData;
        const logoId = logo["@id"] ?? null;
        newSlide.mediaData[logoId] = newSlide?.themeData.logo;
      }

      setRemoteComponentSlide(newSlide);
    }
  }, [slide, mediaData, themeData]);

  useEffect(() => {
    if (showPreview) {
      setRunId(new Date().toISOString());
    }
  }, [showPreview]);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const observer = new ResizeObserver((entries) => {
      if (adjustFontSize) {
        if (entries.length > 0) {
          const first = entries[0];
          setFontSizeEm(
            first.contentRect.width / (orientation === "vertical" ? 1080 : 1920)
          );
        }
      }
    });

    const targets = document.querySelector(".remote-component-wrapper");

    observer.observe(targets);

    return () => {
      observer.unobserve(targets);
    };
  }, []);

  const remoteComponentStyle = {};

  if (adjustFontSize) {
    remoteComponentStyle["--font-size-base"] = `${fontSizeEm}rem`;
  }

  return (
    <>
      {closeButton && (
        <div className="d-flex justify-content-between">
          <Button
            id="close_preview_button"
            variant="primary"
            type="button"
            onClick={closeCallback}
          >
            {t("remote-component-wrapper.close-preview")}
          </Button>
        </div>
      )}
      <div className="remote-component-wrapper">
        <div
          className={`slide remote-component-content ${orientation}`}
          id="EXE-ID-PREVIEW"
          style={remoteComponentStyle}
        >
          <ErrorBoundary errorText="remote-component.error-boundary-text">
            {loading && <div />}
            {!loading && err == null && remoteComponentSlide && Component && (
              <Component
                slide={remoteComponentSlide}
                content={remoteComponentSlide.content}
                run={runId}
                slideDone={() => {}}
                executionId="EXE-ID-PREVIEW"
              />
            )}
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}

RemoteComponentWrapper.propTypes = {
  slide: PropTypes.shape({ content: PropTypes.shape({}).isRequired })
    .isRequired,
  url: PropTypes.string.isRequired,
  mediaData: PropTypes.shape({
    "@id": PropTypes.string,
  }),
  themeData: PropTypes.shape({
    css: PropTypes.string,
  }),
  closeCallback: PropTypes.func,
  showPreview: PropTypes.bool.isRequired,
  closeButton: PropTypes.bool,
  orientation: PropTypes.string,
  adjustFontSize: PropTypes.bool,
};

export default RemoteComponentWrapper;
