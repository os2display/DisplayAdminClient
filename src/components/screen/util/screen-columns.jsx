import { React } from "react";
import { useTranslation } from "react-i18next";
import ListButton from "../../util/list/list-button";
import CampaignIcon from "./campaign-icon";
import SelectColumnHoc from "../../util/select-column-hoc";
import ColumnHoc from "../../util/column-hoc";
import idFromUrl from "../../util/helpers/id-from-url";
import ScreenStatus from "../screen-status";

/**
 * Columns for screens lists.
 *
 * @param {object} props - The props.
 * @param {Function} props.apiCall - The api to call
 * @param {string} props.infoModalRedirect - The url for redirecting in the info modal.
 * @param {string} props.infoModalTitle - The info modal title.
 * @param {string} props.dataKey The data key for mapping the data.
 * @param {boolean} props.displayStatus Should status be displayed?
 * @returns {object} The columns for the screens lists.
 */
function getScreenColumns({
  apiCall,
  infoModalRedirect,
  infoModalTitle,
  dataKey,
  displayStatus,
}) {
  const { t } = useTranslation("common", { keyPrefix: "screen-list" });

  const columns = [
    {
      content: (screen) => (
        <ListButton
          apiCall={apiCall}
          redirectTo={infoModalRedirect}
          displayData={screen.inScreenGroups}
          modalTitle={infoModalTitle}
          dataKey={dataKey}
          delayApiCall={1000}
        />
      ),
      key: "groups",
      label: t("columns.on-groups"),
    },
    {
      path: "location",
      label: t("columns.location"),
    },
    {
      key: "campaign",
      label: t("columns.campaign"),
      // eslint-disable-next-line react/destructuring-assignment
      content: (d) => <CampaignIcon id={idFromUrl(d["@id"])} delay={1000} />,
    },
  ];

  if (displayStatus) {
    columns.push({
      path: "status",
      label: t("columns.status"),
      content: (screen) => {
        return <ScreenStatus screen={screen} mode="minimal" />;
      },
    });
  }

  return columns;
}

const ScreenColumns = ColumnHoc(getScreenColumns);
const SelectScreenColumns = SelectColumnHoc(getScreenColumns);

export { SelectScreenColumns, ScreenColumns };
