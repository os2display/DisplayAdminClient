import { React, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Spinner from "react-bootstrap/Spinner";
import idFromUrl from "../../util/helpers/id-from-url";
import calculateIsPublished from "../../util/helpers/calculate-is-published";
import {
  api,
  useGetV2ScreensByIdCampaignsQuery,
  useGetV2ScreensByIdScreenGroupsQuery,
} from "../../../redux/api/api.generated.ts";

/**
 * An icon to show if the screen has an active campaign.
 *
 * @param {object} props - The props.
 * @param {string} props.id The id of the screen.
 * @param {number} props.delay Delay the fetch.
 * @returns {object} The campaign icon.
 */
function CampaignIcon({ id, delay }) {
  const { t } = useTranslation("common", { keyPrefix: "campaign-icon" });
  const dispatch = useDispatch();
  const [isOverriddenByCampaign, setIsOverriddenByCampaign] = useState(null);
  const [screenCampaignsChecked, setScreenCampaignsChecked] = useState(false);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [getData, setGetData] = useState(false);

  const { data: campaigns, isLoading } = useGetV2ScreensByIdCampaignsQuery(
    { id },
    { skip: !getData }
  );
  const { data: groups, isLoading: isLoadingScreenGroups } =
    useGetV2ScreensByIdScreenGroupsQuery({ id }, { skip: !getData });

  useEffect(() => {
    if (campaigns) {
      setAllCampaigns(
        campaigns["hydra:member"].map(({ campaign }) => campaign)
      );
      setScreenCampaignsChecked(true);
    }
  }, [campaigns]);

  useEffect(() => {
    if (groups && !isOverriddenByCampaign && screenCampaignsChecked) {
      groups["hydra:member"].forEach((group) => {
        dispatch(
          api.endpoints.getV2ScreenGroupsByIdCampaigns.initiate({
            id: idFromUrl(group["@id"]),
          })
        ).then((result) => {
          let allCampaignsCopy = [...allCampaigns];
          if (allCampaignsCopy.length > 0 && result.data) {
            allCampaignsCopy = allCampaignsCopy.concat(
              result.data["hydra:member"].map(({ campaign }) => campaign)
            );
          }
          setAllCampaigns(allCampaignsCopy);
        });
      });
    }
  }, [groups, screenCampaignsChecked]);

  useEffect(() => {
    if (allCampaigns.length > 0 && !isOverriddenByCampaign) {
      allCampaigns.forEach(({ published }) => {
        if (calculateIsPublished(published)) {
          setIsOverriddenByCampaign(true);
        }
      });
    }
  }, [allCampaigns]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGetData(true);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!getData || isLoading || isLoadingScreenGroups) {
    return (
      <div style={{ height: "38px" }}>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="m-1"
        />
      </div>
    );
  }

  return isOverriddenByCampaign
    ? t("overridden-by-campaign")
    : t("not-overridden-by-campaign");
}

CampaignIcon.defaultProps = {
  delay: 1000,
};

CampaignIcon.propTypes = {
  id: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

export default CampaignIcon;
