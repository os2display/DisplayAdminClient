import { React, useContext } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Alert } from "react-bootstrap";
import UserContext from "../../context/user-context";
import Schedule from "../util/schedule/schedule";
import { useGetV2TenantsQuery } from "../../redux/api/api.generated.ts";
import ContentBody from "../util/content-body/content-body";
import TenantsDropdown from "../util/forms/multiselect-dropdown/tenants/tenants-dropdown";

/**
 * The playlist form component.
 *
 * @param {object} props - The props.
 * @param {object} props.playlist The playlist object to modify in the form.
 * @param {Function} props.handleInput Handles form input.
 * @param {boolean} props.highlightSharedSection - Highlight section concerning
 *   shared info
 * @returns {object} The playlist form.
 */
function PlaylistForm({
  handleInput,
  highlightSharedSection = false,
  playlist = null,
}) {
  const { t } = useTranslation("common", { keyPrefix: "playlist-form" });
  const context = useContext(UserContext);

  const { data: tenants } = useGetV2TenantsQuery({
    itemsPerPage: 30,
  });

  return (
    <>
      {playlist && tenants && (
        <>
          <ContentBody>
            <h2 className="h4">{t("schedule-header")}</h2>
            <Schedule
              schedules={playlist.schedules}
              onChange={(schedules) =>
                handleInput({ target: { id: "schedules", value: schedules } })
              }
            />
          </ContentBody>
          <ContentBody
            id="shared-section"
            highlightSection={highlightSharedSection}
          >
            <h2 className="h4">{t("share-playlist")}</h2>
            <TenantsDropdown
              name="tenants"
              handleTenantSelection={handleInput}
              selected={playlist.tenants}
              data={tenants["hydra:member"].filter(({ tenantKey }) => {
                return context.selectedTenant.get.tenantKey !== tenantKey;
              })}
            />
            <Alert className="mt-3 text-dark" variant="warning">
              {t("warning")}
            </Alert>
          </ContentBody>
        </>
      )}
    </>
  );
}

PlaylistForm.propTypes = {
  playlist: PropTypes.shape({
    "@id": PropTypes.string,
    schedules: PropTypes.arrayOf(
      PropTypes.shape({
        duration: PropTypes.number,
        id: PropTypes.string,
        rrule: PropTypes.string,
      })
    ),
    tenants: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string,
        id: PropTypes.string,
        modifiedAt: PropTypes.string,
        modifiedBy: PropTypes.string,
        tenantKey: PropTypes.string,
        title: PropTypes.string,
        userRoleTenants: PropTypes.arrayOf(
          PropTypes.shape({
            description: PropTypes.string,
            roles: PropTypes.arrayOf(PropTypes.string),
            tenantKey: PropTypes.string,
            title: PropTypes.string,
          })
        ),
      })
    ),
  }),
  handleInput: PropTypes.func.isRequired,
  highlightSharedSection: PropTypes.bool,
};

export default PlaylistForm;
