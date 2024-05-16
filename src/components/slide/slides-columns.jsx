import { React } from "react";
import { useTranslation } from "react-i18next";
import TemplateLabelInList from "../util/template-label-in-list";
import ListButton from "../util/list/list-button";
import Published from "../util/published";
import ColumnHoc from "../util/column-hoc";
import SelectColumnHoc from "../util/select-column-hoc";
import Playing from "../util/playing";

/**
 * Columns for slides lists.
 *
 * @param {object} props - The props.
 * @param {Function} props.apiCall - The api to call
 * @param {string} props.infoModalRedirect - The url for redirecting in the info modal.
 * @param {string} props.infoModalTitle - The info modal title.
 * @param {string} props.dataKey The data key for mapping the data. the list button
 * @returns {object} The columns for the slides lists.
 */
function getSlidesColumns({
  apiCall,
  infoModalRedirect,
  infoModalTitle,
  dataKey,
}) {
  const { t } = useTranslation("common", { keyPrefix: "slides-list" });

  const columns = [
    {
      // eslint-disable-next-line react/prop-types
      content: ({ templateInfo }) => (
        <TemplateLabelInList templateInfo={templateInfo} />
      ),
      key: "template",
      label: t("columns.template"),
    },
    {
      key: "playlists",
      // eslint-disable-next-line react/prop-types
      content: ({ onPlaylists }) => (
        <ListButton
          apiCall={apiCall}
          redirectTo={infoModalRedirect}
          displayData={onPlaylists}
          modalTitle={infoModalTitle}
          dataKey={dataKey}
        />
      ),
      label: t("columns.slide-on-playlists"),
    },
    {
      key: "published",
      // eslint-disable-next-line react/prop-types
      content: ({ published }) => <Published published={published} />,
      label: t("columns.published"),
    },
    {
      path: "playing",
      label: t("columns.playing"),
      // eslint-disable-next-line react/prop-types
      content: ({ publishedFrom, publishedTo, published }) => (
        <Playing
          published={published || { from: publishedFrom, to: publishedTo }}
        />
      ),
    },
  ];

  return columns;
}

const SlideColumns = ColumnHoc(getSlidesColumns);
const SelectSlideColumns = SelectColumnHoc(getSlidesColumns);

export { SelectSlideColumns, SlideColumns };
