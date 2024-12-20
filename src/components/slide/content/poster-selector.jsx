import { React, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Button, Card, Row, Spinner } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import Col from "react-bootstrap/Col";
import dayjs from "dayjs";
import localeDa from "dayjs/locale/da";
import Select from "../../util/forms/select";
import FormInput from "../../util/forms/form-input";
import FormCheckbox from "../../util/forms/form-checkbox";
import localStorageKeys from "../../util/local-storage-keys";

/**
 * @param {object} props Props.
 * @param {object} props.feedSource Feed source.
 * @param {Function} props.getValueFromConfiguration Gets a value from the feed
 *   configuration.
 * @param {Function} props.configurationChange Configuration onChange.
 * @returns {object} PosterSelector component.
 */
function PosterSelector({
  feedSource,
  getValueFromConfiguration,
  configurationChange,
}) {
  const { t } = useTranslation("common");
  const apiToken = localStorage.getItem(localStorageKeys.API_TOKEN);
  const tenantKey = JSON.parse(
    localStorage.getItem(localStorageKeys.SELECTED_TENANT)
  );

  const headers = {
    authorization: `Bearer ${apiToken ?? ""}`,
  };

  if (tenantKey) {
    headers["Authorization-Tenant-Key"] = tenantKey.tenantKey;
  }

  const [singleSearch, setSingleSearch] = useState("");
  const [singleSearchType, setSingleSearchType] = useState("title");
  const [singleSearchTypeValue, setSingleSearchTypeValue] = useState("");
  const [singleSearchEvents, setSingleSearchEvents] = useState(null);
  const [singleDisplayOverrides, setSingleDisplayOverrides] = useState(false);

  const [singleSelectedEvent, setSingleSelectedEvent] = useState(
    getValueFromConfiguration("singleSelectedEvent") ?? null
  );
  const [singleSelectedOccurrence, setSingleSelectedOccurrence] = useState(
    getValueFromConfiguration("singleSelectedOccurrence") ?? null
  );

  const [subscriptionPlaceValue, setSubscriptionPlaceValue] = useState(
    getValueFromConfiguration("subscriptionPlaceValue") ?? []
  );
  const [subscriptionOrganizerValue, setSubscriptionOrganizerValue] = useState(
    getValueFromConfiguration("subscriptionOrganizerValue") ?? []
  );
  const [subscriptionTagValue, setSubscriptionTagValue] = useState(
    getValueFromConfiguration("subscriptionTagValue") ?? []
  );
  const [subscriptionNumberValue, setSubscriptionNumberValue] = useState(
    getValueFromConfiguration("subscriptionNumberValue") ?? 5
  );

  const [subscriptionEvents, setSubscriptionEvents] = useState(null);

  const [loadingResults, setLoadingResults] = useState(false);
  const posterType = getValueFromConfiguration("posterType");

  useEffect(() => {
    if (posterType === "single") {
      const url = feedSource.admin[0].endpointEntity;
      const eventId = getValueFromConfiguration("singleSelectedEvent");
      const occurrenceId = getValueFromConfiguration(
        "singleSelectedOccurrence"
      );

      console.log(occurrenceId, "occurrenceId");

      if (eventId !== null) {
        fetch(`${url}?path=${eventId}`, {
          headers,
        })
          .then((response) => response.json())
          .then((data) => {
            setSingleSelectedEvent(data);
          })
          .catch(() => {
            // TODO: Display error.
          });
      }

      if (occurrenceId !== null) {
        fetch(`${url}?path=/occurrences/${occurrenceId}`, {
          headers,
        })
          .then((response) => response.json())
          .then((data) => {
            setSingleSelectedOccurrence(data["hydra:member"][0]);
          })
          .catch(() => {
            // TODO: Display error.
          });
      }
    }
  }, []);

  useEffect(() => {
    configurationChange({
      target: {
        id: "singleSelectedEvent",
        value: singleSelectedEvent ? singleSelectedEvent["@id"] : null,
      },
    });
  }, [singleSelectedEvent]);

  useEffect(() => {
    configurationChange({
      target: {
        id: "singleSelectedOccurrence",
        value: singleSelectedOccurrence
          ? singleSelectedOccurrence.entityId
          : null,
      },
    });
  }, [singleSelectedOccurrence]);

  useEffect(() => {
    if (subscriptionPlaceValue) {
      configurationChange({
        target: { id: "subscriptionPlaceValue", value: subscriptionPlaceValue },
      });
    }
  }, [subscriptionPlaceValue]);

  useEffect(() => {
    if (subscriptionOrganizerValue) {
      configurationChange({
        target: {
          id: "subscriptionOrganizerValue",
          value: subscriptionOrganizerValue,
        },
      });
    }
  }, [subscriptionOrganizerValue]);

  useEffect(() => {
    if (subscriptionTagValue) {
      configurationChange({
        target: { id: "subscriptionTagValue", value: subscriptionTagValue },
      });
    }
  }, [subscriptionTagValue]);

  useEffect(() => {
    if (subscriptionNumberValue) {
      configurationChange({
        target: {
          id: "subscriptionNumberValue",
          value: subscriptionNumberValue,
        },
      });
    }
  }, [subscriptionNumberValue]);

  const subscriptionFetch = () => {
    const url = feedSource.admin[0].endpointSearch;
    let query = `?type=events`;

    const places = subscriptionPlaceValue.map((option) => option.value);

    places.forEach((place) => {
      query = `${query}&place=${place}`;
    });

    const organizers = subscriptionOrganizerValue.map((option) => option.value);

    organizers.forEach((organizer) => {
      query = `${query}&organizer=${organizer}`;
    });

    const tags = subscriptionTagValue.map((option) => option.value);

    tags.forEach((tag) => {
      query = `${query}&tag=${tag}`;
    });

    query = `${query}&items_per_page=${subscriptionNumberValue}`;

    setLoadingResults(true);

    fetch(`${url}${query}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setSubscriptionEvents(data);
      })
      .catch(() => {
        // @TODO: Handle error.
      })
      .finally(() => {
        setLoadingResults(false);
      });
  };

  // Fetch results.
  useEffect(() => {
    if (posterType === "subscription") {
      subscriptionFetch();
    }
  }, [
    subscriptionPlaceValue,
    subscriptionOrganizerValue,
    subscriptionTagValue,
    subscriptionNumberValue,
  ]);

  const handleSelectEvent = (singleEvent) => {
    setSingleSelectedEvent(singleEvent);
    if (singleEvent.occurrences?.length === 1) {
      setSingleSelectedOccurrence(singleEvent.occurrences[0]);
    }
  };

  const singleSearchFetch = () => {
    const url = feedSource.admin[0].endpointSearch;
    let query = `?type=events`;

    const singleSearchTypeValueId = singleSearchTypeValue
      ? singleSearchTypeValue.value.split("/").pop()
      : null;

    switch (singleSearchType) {
      case "title":
        query = `${query}&title=${singleSearch}`;
        break;
      case "url":
        query = `${query}&url=${singleSearch}`;
        break;
      case "tags":
        query = `${query}&tag=${singleSearchTypeValueId}`;
        break;
      case "organizers":
        query = `${query}&organizer=${singleSearchTypeValueId}`;
        break;
      case "places":
        query = `${query}&place=${singleSearchTypeValueId}`;
        break;
      default:
    }

    setLoadingResults(true);

    fetch(`${url}${query}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setSingleSearchEvents(data);
      })
      .catch(() => {
        // @TODO: Handle error.
      })
      .finally(() => {
        setLoadingResults(false);
      });
  };

  const singleSearchTypeOptions = [
    {
      key: "singleSearchTypeOptions1",
      value: "title",
      title: t("poster-selector.single-search-type-title"),
    },
    {
      key: "singleSearchTypeOptions2",
      value: "url",
      title: t("poster-selector.single-search-type-url"),
    },
    {
      key: "singleSearchTypeOptions3",
      value: "organizers",
      title: t("poster-selector.single-search-type-organizer"),
    },
    {
      key: "singleSearchTypeOptions4",
      value: "places",
      title: t("poster-selector.single-search-type-place"),
    },
    {
      key: "singleSearchTypeOptions5",
      value: "tags",
      title: t("poster-selector.single-search-type-tag"),
    },
  ];

  const loadDropdownOptions = (inputValue, callback, type) => {
    const url = feedSource.admin[0].endpointSearch;

    let query = `?type=${type}&display=options`;

    if (inputValue) {
      query = `${query}&title=${inputValue}`;
    }

    // TODO: Get this endpoint in a different way.
    fetch(`${url}${query}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        callback(data);
      })
      .catch(() => {
        callback([]);
        // TODO: Display error.
      });
  };

  const capitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const formatDate = (date, format) => {
    if (!date) return "";
    return capitalize(
      dayjs(date)
        .locale(localeDa)
        .format(format ?? "LLLL")
    );
  };

  const numberOptions = Array.from(Array(10).keys());

  const removeSingleSelected = () => {
    setSingleSelectedEvent(null);
    setSingleSelectedOccurrence(null);
  };

  /* eslint-disable jsx-a11y/control-has-associated-label */
  return (
    <Card className="mb-3">
      <Card.Body>
        {!posterType && (
          <Row>
            <Col>
              <h5>{t("poster-selector.select-mode")}</h5>
            </Col>
            <Col>
              <Button
                onClick={() =>
                  configurationChange({
                    target: {
                      id: "posterType",
                      value: "single",
                    },
                  })
                }
              >
                {t("poster-selector.poster-feed-type-single")}
              </Button>
            </Col>
            <Col>
              <Button
                onClick={() =>
                  configurationChange({
                    target: {
                      id: "posterType",
                      value: "subscription",
                    },
                  })
                }
              >
                {t("poster-selector.poster-feed-type-subscription")}
              </Button>
            </Col>
          </Row>
        )}
        {posterType && (
          <div className="mb-3">
            {posterType === "single" && (
              <>
                <h5>{t("poster-selector.selected-type-single")}</h5>
                {(singleSelectedEvent || singleSelectedOccurrence) && (
                  <>
                    <Row>
                      <Col md="9">
                        <>
                          {singleSelectedEvent && (
                            <div>
                              <strong>Valgt begivenhed:</strong>{" "}
                              {singleSelectedEvent.title} (
                              {singleSelectedEvent?.organizer?.name})
                            </div>
                          )}
                          {singleSelectedOccurrence && (
                            <div>
                              <strong>
                                {t("poster-selector.chosen-occurrence")}:
                              </strong>{" "}
                              {formatDate(singleSelectedOccurrence.start)} -
                              {singleSelectedOccurrence.ticketPriceRange}
                            </div>
                          )}
                        </>
                      </Col>
                      <Col md="3">
                        <Button variant="danger" onClick={removeSingleSelected}>
                          {t("poster-selector.remove")}
                        </Button>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col>
                        <Button
                          onClick={() =>
                            setSingleDisplayOverrides(!singleDisplayOverrides)
                          }
                        >
                          {singleDisplayOverrides
                            ? t("poster-selector.hide-overrides")
                            : t("poster-selector.display-overrides")}
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        {singleDisplayOverrides && (
                          <>
                            <FormInput
                              label={t("poster-selector.single-override-title")}
                              name="overrideTitle"
                              value={
                                getValueFromConfiguration("overrideTitle") ?? ""
                              }
                              onChange={configurationChange}
                              className="mb-3"
                            />
                            <FormInput
                              label={t(
                                "poster-selector.single-override-subtitle"
                              )}
                              name="overrideSubTitle"
                              value={
                                getValueFromConfiguration("overrideSubTitle") ??
                                ""
                              }
                              onChange={configurationChange}
                              className="mb-3"
                            />
                            <FormInput
                              label={t(
                                "poster-selector.single-override-ticket-price"
                              )}
                              name="overrideTicketPrice"
                              value={
                                getValueFromConfiguration(
                                  "overrideTicketPrice"
                                ) ?? ""
                              }
                              onChange={configurationChange}
                              className="mb-3"
                            />
                            <FormInput
                              label={t("poster-selector.single-read-more-text")}
                              name="readMoreText"
                              value={
                                getValueFromConfiguration("readMoreText") ?? ""
                              }
                              onChange={configurationChange}
                              className="mb-3"
                            />
                            <FormInput
                              label={t("poster-selector.single-read-more-url")}
                              name="overrideReadMoreUrl"
                              value={
                                getValueFromConfiguration(
                                  "overrideReadMoreUrl"
                                ) ?? ""
                              }
                              onChange={configurationChange}
                              className="mb-3"
                            />
                            <FormCheckbox
                              label={t("poster-selector.single-hide-time")}
                              name="hideTime"
                              value={
                                getValueFromConfiguration("hideTime") ?? false
                              }
                              onChange={configurationChange}
                              className="mb-3"
                            />
                          </>
                        )}
                      </Col>
                    </Row>
                  </>
                )}

                {(!singleSelectedEvent || !singleSelectedOccurrence) && (
                  <>
                    <Row>
                      <h5 className="mt-2">
                        {t("poster-selector.search-for-event")}
                      </h5>
                    </Row>
                    <Row>
                      <Col>
                        <Select
                          value={singleSearchType}
                          onChange={({ target }) =>
                            setSingleSearchType(target.value)
                          }
                          label={t("poster-selector.single-search-type")}
                          options={singleSearchTypeOptions}
                          name="poster-search-type"
                          allowNull={false}
                        />
                      </Col>
                      {(singleSearchType === "title" ||
                        singleSearchType === "url") && (
                        <Col>
                          <FormInput
                            label={t("poster-selector.single-search-text")}
                            name="poster-search"
                            value={singleSearch}
                            onChange={({ target }) =>
                              setSingleSearch(target.value)
                            }
                          />
                        </Col>
                      )}
                      {(singleSearchType === "tags" ||
                        singleSearchType === "places" ||
                        singleSearchType === "organizers") && (
                        <Col>
                          <label
                            className="form-label"
                            htmlFor="single-search-select"
                          >
                            {t("poster-selector.single-search-select")}
                          </label>
                          <AsyncSelect
                            id="single-search-select"
                            isClearable
                            isSearchable
                            defaultOptions
                            loadOptions={(inputValue, callback) =>
                              loadDropdownOptions(
                                inputValue,
                                callback,
                                singleSearchType
                              )
                            }
                            defaultInputValue={singleSearchTypeValue}
                            onChange={(newValue) => {
                              setSingleSearchTypeValue(newValue);
                            }}
                          />
                        </Col>
                      )}
                      <Col className="d-flex align-items-end">
                        <Button
                          onClick={singleSearchFetch}
                          className="mt-3"
                          variant="success"
                        >
                          {t("poster-selector.single-search-button")}
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      {!singleSelectedEvent && singleSearchEvents !== null && (
                        <Col>
                          <table className="table table-hover text-left">
                            <thead>
                              <tr>
                                <th scope="col">
                                  {t("poster-selector.table-image")}
                                </th>
                                <th scope="col">
                                  {t("poster-selector.table-event")}
                                </th>
                                <th scope="col">
                                  {t("poster-selector.table-date")}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {singleSearchEvents?.map((searchEvent) => (
                                <tr
                                  style={{ cursor: "pointer" }}
                                  key={searchEvent["@id"]}
                                  onClick={() => handleSelectEvent(searchEvent)}
                                >
                                  <td>
                                    {searchEvent?.imageUrls?.small && (
                                      <img
                                        src={searchEvent?.imageUrls?.small}
                                        alt={searchEvent?.title}
                                        style={{ maxWidth: "80px" }}
                                      />
                                    )}
                                  </td>
                                  <td>
                                    <strong>{searchEvent.title}</strong>
                                    <br />
                                    {searchEvent.organizer.name}
                                  </td>
                                  <td>
                                    {searchEvent?.occurrences?.length > 0 &&
                                      formatDate(
                                        searchEvent?.occurrences[0]?.start
                                      )}
                                    {searchEvent?.occurrences?.length > 1 && (
                                      <span>, ...</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                              {singleSearchEvents?.length === 0 && (
                                <tr>
                                  <td colSpan="3">
                                    {t("poster-selector.no-results")}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </Col>
                      )}
                      {loadingResults && (
                        <Col>
                          <Spinner className="mt-3" animation="border" />
                        </Col>
                      )}

                      {singleSelectedEvent !== null && (
                        <Col>
                          <h5>{t("poster-selector.choose-an-occurrence")}</h5>
                          {!singleSelectedOccurrence && (
                            <>
                              <table className="table table-hover text-left">
                                <thead>
                                  <tr>
                                    <th scope="col">
                                      {t("poster-selector.table-date")}
                                    </th>
                                    <th scope="col">
                                      {t("poster-selector.table-price")}
                                    </th>
                                    <th scope="col"> </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {singleSelectedEvent?.occurrences?.map(
                                    (occurrence) => (
                                      <tr>
                                        <td>{occurrence.start}</td>
                                        <td>{occurrence.ticketPriceRange}</td>
                                        <td>
                                          <Button
                                            onClick={() =>
                                              setSingleSelectedOccurrence(
                                                occurrence
                                              )
                                            }
                                          >
                                            {t(
                                              "poster-selector.choose-occurrence"
                                            )}
                                          </Button>
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </>
                          )}
                        </Col>
                      )}
                    </Row>
                  </>
                )}
              </>
            )}
            {posterType === "subscription" && (
              <>
                <Row>
                  <Col>
                    <h5>{t("poster-selector.selected-type-subscription")}</h5>
                    <small className="form-text">
                      {t("poster-selector.subscription-helptext")}
                    </small>

                    <Row>
                      <Col md="3" className="bg-light">
                        <h5 className="mt-3">{t("poster-selector.filters")}</h5>
                        <div className="mb-2">
                          <div className="form-group">
                            <label htmlFor="os2display-poster--select-subscription-places">
                              {t("poster-selector.filters-place")}
                            </label>
                            <AsyncSelect
                              id="subscription-search-place"
                              isClearable
                              isSearchable
                              defaultOptions
                              isMulti
                              loadOptions={(inputValue, callback) =>
                                loadDropdownOptions(
                                  inputValue,
                                  callback,
                                  "places"
                                )
                              }
                              value={subscriptionPlaceValue}
                              onChange={(newValue) => {
                                setSubscriptionPlaceValue(newValue);
                              }}
                            />
                            <small className="form-text">
                              {t("poster-selector.filter-place-helptext")}
                            </small>
                          </div>
                        </div>

                        <div className="mb-2">
                          <div className="form-group">
                            <label htmlFor="os2display-poster--select-subscription-organizers">
                              {t("poster-selector.filters-organizer")}
                            </label>
                            <AsyncSelect
                              id="subscription-search-place"
                              isClearable
                              isSearchable
                              defaultOptions
                              isMulti
                              loadOptions={(inputValue, callback) =>
                                loadDropdownOptions(
                                  inputValue,
                                  callback,
                                  "organizers"
                                )
                              }
                              value={subscriptionOrganizerValue}
                              onChange={(newValue) => {
                                setSubscriptionOrganizerValue(newValue);
                              }}
                            />
                            <small className="form-text">
                              {t("poster-selector.filter-organizer-helptext")}
                            </small>
                          </div>
                        </div>

                        <div className="mb-2">
                          <div className="form-group">
                            <label htmlFor="os2display-poster--select-subscription-tags">
                              {t("poster-selector.filters-tag")}
                            </label>
                            <AsyncSelect
                              id="subscription-search-place"
                              isClearable
                              isSearchable
                              defaultOptions
                              isMulti
                              loadOptions={(inputValue, callback) =>
                                loadDropdownOptions(
                                  inputValue,
                                  callback,
                                  "tags"
                                )
                              }
                              value={subscriptionTagValue}
                              onChange={(newValue) => {
                                setSubscriptionTagValue(newValue);
                              }}
                            />
                            <small className="form-text">
                              {t("poster-selector.filter-tag-helptext")}
                            </small>
                          </div>
                        </div>

                        <div>
                          <div className="form-group">
                            <div>
                              <label htmlFor="os2display-poster--select-number">
                                {t("poster-selector.number-of-slides")}
                                <select
                                  id="os2display-poster--select-number"
                                  value={subscriptionNumberValue}
                                  onChange={({ target }) =>
                                    setSubscriptionNumberValue(target.value)
                                  }
                                >
                                  {numberOptions?.map((i) => (
                                    <option value={i + 1}>{i + 1}</option>
                                  ))}
                                </select>
                              </label>
                            </div>
                            <span className="small text-muted">
                              {t("poster-selector.number-of-slides-helptext")}
                            </span>
                          </div>
                        </div>
                      </Col>
                      <div className="col-md-9">
                        <div>
                          <h5 className="mt-3">
                            {t("poster-selector.preview-of-events")}
                          </h5>
                          <table className="table table-hover text-left">
                            <thead>
                              <tr>
                                <th scope="col">
                                  {t("poster-selector.table-image")}
                                </th>
                                <th scope="col">
                                  {t("poster-selector.table-event")}
                                </th>
                                <th scope="col">
                                  {t("poster-selector.table-place")}
                                </th>
                                <th scope="col">
                                  {t("poster-selector.table-date")}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {loadingResults && <Spinner animation="border" />}
                              {subscriptionEvents?.map((event) => {
                                const firstOccurrence =
                                  event?.occurrences.length > 0
                                    ? event.occurrences[0]
                                    : null;

                                return (
                                  <tr>
                                    <td>
                                      <img
                                        src={event?.imageUrls?.small}
                                        alt={event.name}
                                        style={{ maxWidth: "80px" }}
                                      />
                                    </td>
                                    <td>
                                      <strong>{event.name}</strong>
                                      <br />
                                      {event?.organizer?.name}
                                    </td>
                                    <td>
                                      {firstOccurrence &&
                                        firstOccurrence.place?.name}
                                    </td>
                                    <td>
                                      {firstOccurrence && (
                                        <>
                                          {`${formatDate(
                                            firstOccurrence.start,
                                            "L"
                                          )} - ${formatDate(
                                            firstOccurrence.end,
                                            "L"
                                          )}`}
                                        </>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </Row>
                  </Col>
                </Row>
              </>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
  /* eslint-enable jsx-a11y/control-has-associated-label */
}

PosterSelector.propTypes = {
  getValueFromConfiguration: PropTypes.func.isRequired,
  configurationChange: PropTypes.func.isRequired,
  feedSource: PropTypes.shape({
    admin: PropTypes.arrayOf(
      PropTypes.shape({
        endpointEntity: PropTypes.string,
        endpointSearch: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default PosterSelector;
