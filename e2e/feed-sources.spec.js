import { test, expect } from "@playwright/test";

const feedSourcesJson = {
  "@context": "/contexts/FeedSource",
  "@id": "/v2/feed-sources",
  "@type": "hydra:Collection",
  "hydra:totalItems": 5,
  "hydra:member": [
    {
      "@id": "/v2/feed-sources/01JBBP48CS9CV80XRWRP8CAETJ",
      "@type": "FeedSource",
      title: "test 2",
      description: "test 2",
      outputType: "",
      feedType: "test 2",
      secrets: [],
      feeds: [],
      admin: [],
      supportedFeedOutputType: "test 2",
      modifiedBy: "admin@example.com",
      createdBy: "admin@example.com",
      id: "01JBBP48CS9CV80XRWRP8CAETJ",
      created: "2024-10-29T09:26:25.000Z",
      modified: "2024-10-29T09:26:25.000Z",
    },
    {
      "@id": "/v2/feed-sources/01JB9MSQEH75HC3GG75XCVP2WH",
      "@type": "FeedSource",
      title: "Ny datakilde test 3",
      description: "Ny datakilde test 3",
      outputType: "",
      feedType: "App\\Feed\\RssFeedType",
      secrets: [],
      feeds: [
        "/v2/feeds/01JB9R7EPN9NPW117C22NY31KH",
        "/v2/feeds/01JBBQMF72W2V36TWF6VXFA5Z7",
      ],
      admin: [
        {
          key: "rss-url",
          input: "input",
          name: "url",
          type: "url",
          label: "Kilde",
          helpText: "Her kan du skrive rss kilden",
          formGroupClasses: "col-md-6",
        },
        {
          key: "rss-number-of-entries",
          input: "input",
          name: "numberOfEntries",
          type: "number",
          label: "Antal indgange",
          helpText:
            "Her kan du skrive, hvor mange indgange, der maksimalt skal vises.",
          formGroupClasses: "col-md-6 mb-3",
        },
        {
          key: "rss-entry-duration",
          input: "input",
          name: "entryDuration",
          type: "number",
          label: "Varighed pr. indgang (i sekunder)",
          helpText: "Her skal du skrive varigheden pr. indgang.",
          formGroupClasses: "col-md-6 mb-3",
        },
      ],
      supportedFeedOutputType: "rss",
      modifiedBy: "admin@example.com",
      createdBy: "admin@example.com",
      id: "01JB9MSQEH75HC3GG75XCVP2WH",
      created: "2024-10-28T14:24:43.000Z",
      modified: "2024-10-28T15:23:28.000Z",
    },
    {
      "@id": "/v2/feed-sources/01JB1DH8G4CXKGX5JRTYDHDPSP",
      "@type": "FeedSource",
      title: "Calendar datakilde test",
      description: "test",
      outputType: "",
      feedType: "App\\Feed\\CalendarApiFeedType",
      secrets: [],
      feeds: [],
      admin: [],
      supportedFeedOutputType: "calendar",
      modifiedBy: "",
      createdBy: "",
      id: "01JB1DH8G4CXKGX5JRTYDHDPSP",
      created: "2024-10-25T10:43:50.000Z",
      modified: "2024-10-25T10:43:50.000Z",
    },
    {
      "@id": "/v2/feed-sources/01J711Y2Q01VBJ1Y7A1HZQ0ZN6",
      "@type": "FeedSource",
      title: "feed_source_abc_notified",
      description:
        "Ut magnam veritatis velit ut doloribus id. Consequatur ut ipsum exercitationem aliquam laudantium voluptate voluptates perspiciatis. Id occaecati ea rerum facilis molestias et.",
      outputType: "",
      feedType: "App\\Feed\\RssFeedType",
      secrets: [],
      feeds: ["/v2/feeds/01GJD7S1KR10811MTA176C001R"],
      admin: [
        {
          key: "rss-url",
          input: "input",
          name: "url",
          type: "url",
          label: "Kilde",
          helpText: "Her kan du skrive rss kilden",
          formGroupClasses: "col-md-6",
        },
        {
          key: "rss-number-of-entries",
          input: "input",
          name: "numberOfEntries",
          type: "number",
          label: "Antal indgange",
          helpText:
            "Her kan du skrive, hvor mange indgange, der maksimalt skal vises.",
          formGroupClasses: "col-md-6 mb-3",
        },
        {
          key: "rss-entry-duration",
          input: "input",
          name: "entryDuration",
          type: "number",
          label: "Varighed pr. indgang (i sekunder)",
          helpText: "Her skal du skrive varigheden pr. indgang.",
          formGroupClasses: "col-md-6 mb-3",
        },
      ],
      supportedFeedOutputType: "instagram",
      modifiedBy: "",
      createdBy: "",
      id: "01J711Y2Q01VBJ1Y7A1HZQ0ZN6",
      created: "2024-09-05T12:18:20.000Z",
      modified: "2024-09-17T09:33:12.000Z",
    },
    {
      "@id": "/v2/feed-sources/01J1H8GVVR1CVJ1SQK0JXN1X4Q",
      "@type": "FeedSource",
      title: "feed_source_abc_1",
      description:
        "Totam eos molestias omnis aliquam quia qui voluptas. Non eum nihil ut sunt dolor.",
      outputType: "",
      feedType: "App\\Feed\\RssFeedType",
      secrets: [],
      feeds: ["/v2/feeds/01HD49075G0FNY1FNX12VE17K1"],
      admin: [
        {
          key: "rss-url",
          input: "input",
          name: "url",
          type: "url",
          label: "Kilde",
          helpText: "Her kan du skrive rss kilden",
          formGroupClasses: "col-md-6",
        },
        {
          key: "rss-number-of-entries",
          input: "input",
          name: "numberOfEntries",
          type: "number",
          label: "Antal indgange",
          helpText:
            "Her kan du skrive, hvor mange indgange, der maksimalt skal vises.",
          formGroupClasses: "col-md-6 mb-3",
        },
        {
          key: "rss-entry-duration",
          input: "input",
          name: "entryDuration",
          type: "number",
          label: "Varighed pr. indgang (i sekunder)",
          helpText: "Her skal du skrive varigheden pr. indgang.",
          formGroupClasses: "col-md-6 mb-3",
        },
      ],
      supportedFeedOutputType: "rss",
      modifiedBy: "",
      createdBy: "",
      id: "01J1H8GVVR1CVJ1SQK0JXN1X4Q",
      created: "2024-06-29T05:47:07.000Z",
      modified: "2024-10-21T18:01:25.000Z",
    },
  ],
};

test.describe("fest", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/feed-sources/list");
    await page.route("**/feed-sources*", async (route) => {
      await route.fulfill({ json: feedSourcesJson });
    });
    await page.route("**/token", async (route) => {
      const json = {
        token: "1",
        refresh_token: "2",
        tenants: [
          {
            tenantKey: "ABC",
            title: "ABC Tenant",
            description: "Description",
            roles: ["ROLE_ADMIN"],
          },
        ],
        user: {
          fullname: "John Doe",
          email: "johndoe@example.com",
        },
      };
      await route.fulfill({ json });
    });
    await expect(page).toHaveTitle(/OS2Display admin/);
    await page.getByLabel("Email").fill("admin@example.com");
    await page.getByLabel("Kodeord").fill("password");
    await page.locator("#login").click();
  });

  test("It loads create datakilde page", async ({ page }) => {
    page.getByText("Opret ny datakilde").click();
    await expect(page.locator("#save")).toBeVisible();
  });

  test("It display error toast on save error", async ({ page }) => {
    await page.route("**/feed-sources", async (route) => {
      const json = {
        "@context": "/contexts/Error",
        "@type": "hydra:Error",
        "hydra:title": "An error occurred",
        "hydra:description": "An error occurred",
      };
      await route.fulfill({ status: 500, json });
    });
    page.getByText("Opret ny datakilde").click();

    // Displays error toast and stays on page
    await expect(
      page.locator(".Toastify").locator(".Toastify__toast--error")
    ).not.toBeVisible();
    await page.locator("#save").click();
    await expect(
      page.locator(".Toastify").locator(".Toastify__toast--error")
    ).toBeVisible();
    await expect(
      page
        .locator(".Toastify")
        .locator(".Toastify__toast--error")
        .getByText(/An error occurred/)
        .first()
    ).toBeVisible();
    await expect(page).toHaveURL(/feed-sources\/create/);
  });
  test("Cancel create datakilde", async ({ page }) => {
    page.getByText("Opret ny datakilde").click();
    await expect(page.locator("#cancel")).toBeVisible();
    await page.locator("#cancel").click();
    await expect(page.locator("#cancel")).not.toBeVisible();
  });
});


test.describe("datakilde list work", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/feed-sources/list");
    await page.route("**/token", async (route) => {
      const json = {
        token: "1",
        refresh_token: "2",
        tenants: [
          {
            tenantKey: "ABC",
            title: "ABC Tenant",
            description: "Description",
            roles: ["ROLE_ADMIN"],
          },
        ],
        user: {
          fullname: "John Doe",
          email: "johndoe@example.com",
        },
      };
      await route.fulfill({ json });
    });
    await page.route("**/feed-sources*", async (route) => {
      await route.fulfill({ json: feedSourcesJson });
    });
    await expect(page).toHaveTitle(/OS2Display admin/);
    await page.getByLabel("Email").fill("johndoe@example.com");
    await page.getByLabel("Kodeord").fill("password");
    await page.locator("#login").click();
  });

  test("It loads datakilde list", async ({ page }) => {
    await expect(page.locator("table").locator("tbody")).not.toBeEmpty();
    await expect(page.locator("tbody").locator("tr td").first()).toBeVisible();
  });

  test("It goes to edit", async ({ page }) => {
    await expect(page.locator("#feed-sourceTitle")).not.toBeVisible();

    await page.route("**/feed-sources*", async (route) => {
      const json = {
        "@context": "/contexts/FeedSource",
        "@id": "/v2/feed-sources",
        "@type": "hydra:Collection",
        "hydra:totalItems": 2,
        "hydra:member": [
          {
            "@id": "/v2/feed-sources/01J711Y2Q01VBJ1Y7A1HZQ0ZN6",
            "@type": "FeedSource",
            "title": "feed_source_abc_notified",
            "description": "Ut magnam veritatis velit ut doloribus id. Consequatur ut ipsum exercitationem aliquam laudantium voluptate voluptates perspiciatis. Id occaecati ea rerum facilis molestias et.",
            "outputType": "",
            "feedType": "App\\Feed\\RssFeedType",
            "secrets": [],
            "feeds": [
              "/v2/feeds/01GJD7S1KR10811MTA176C001R"
            ],
            "admin": [
              {
                "key": "rss-url",
                "input": "input",
                "name": "url",
                "type": "url",
                "label": "Kilde",
                "helpText": "Her kan du skrive rss kilden",
                "formGroupClasses": "col-md-6"
              },
              {
                "key": "rss-number-of-entries",
                "input": "input",
                "name": "numberOfEntries",
                "type": "number",
                "label": "Antal indgange",
                "helpText": "Her kan du skrive, hvor mange indgange, der maksimalt skal vises.",
                "formGroupClasses": "col-md-6 mb-3"
              },
              {
                "key": "rss-entry-duration",
                "input": "input",
                "name": "entryDuration",
                "type": "number",
                "label": "Varighed pr. indgang (i sekunder)",
                "helpText": "Her skal du skrive varigheden pr. indgang.",
                "formGroupClasses": "col-md-6 mb-3"
              }
            ],
            "supportedFeedOutputType": "instagram",
            "modifiedBy": "",
            "createdBy": "",
            "id": "01J711Y2Q01VBJ1Y7A1HZQ0ZN6",
            "created": "2024-09-05T12:18:20.000Z",
            "modified": "2024-09-17T09:33:12.000Z"
          },
          {
            "@id": "/v2/feed-sources/01J1H8GVVR1CVJ1SQK0JXN1X4Q",
            "@type": "FeedSource",
            "title": "feed_source_abc_1",
            "description": "Totam eos molestias omnis aliquam quia qui voluptas. Non eum nihil ut sunt dolor.",
            "outputType": "",
            "feedType": "App\\Feed\\RssFeedType",
            "secrets": [],
            "feeds": [
              "/v2/feeds/01HD49075G0FNY1FNX12VE17K1"
            ],
            "admin": [
              {
                "key": "rss-url",
                "input": "input",
                "name": "url",
                "type": "url",
                "label": "Kilde",
                "helpText": "Her kan du skrive rss kilden",
                "formGroupClasses": "col-md-6"
              },
              {
                "key": "rss-number-of-entries",
                "input": "input",
                "name": "numberOfEntries",
                "type": "number",
                "label": "Antal indgange",
                "helpText": "Her kan du skrive, hvor mange indgange, der maksimalt skal vises.",
                "formGroupClasses": "col-md-6 mb-3"
              },
              {
                "key": "rss-entry-duration",
                "input": "input",
                "name": "entryDuration",
                "type": "number",
                "label": "Varighed pr. indgang (i sekunder)",
                "helpText": "Her skal du skrive varigheden pr. indgang.",
                "formGroupClasses": "col-md-6 mb-3"
              }
            ],
            "supportedFeedOutputType": "rss",
            "modifiedBy": "",
            "createdBy": "",
            "id": "01J1H8GVVR1CVJ1SQK0JXN1X4Q",
            "created": "2024-06-29T05:47:07.000Z",
            "modified": "2024-10-21T18:01:25.000Z"
          }
        ]
      };
      await route.fulfill({ json });
    });

    await page.route("**/feed-sources/*", async (route) => {
      const json = {
        "@id": "/v2/feed-sources/01J711Y2Q01VBJ1Y7A1HZQ0ZN6",
        "@type": "FeedSource",
        "title": "feed_source_abc_notified",
        "description": "Ut magnam veritatis velit ut doloribus id. Consequatur ut ipsum exercitationem aliquam laudantium voluptate voluptates perspiciatis. Id occaecati ea rerum facilis molestias et.",
        "outputType": "",
        "feedType": "App\\Feed\\RssFeedType",
        "secrets": [],
        "feeds": [
          "/v2/feeds/01GJD7S1KR10811MTA176C001R"
        ],
        "supportedFeedOutputType": "instagram",
        "modifiedBy": "",
        "createdBy": "",
        "id": "01J711Y2Q01VBJ1Y7A1HZQ0ZN6",
        "created": "2024-09-05T12:18:20.000Z",
        "modified": "2024-09-17T09:33:12.000Z"
      };

      await route.fulfill({ json });
    });

    await page.locator("tbody").locator("tr td a").first().click();
    await expect(page.locator("#feed-sourceTitle")).toBeVisible();
  });

  test("It opens delete modal", async ({ page }) => {
    await expect(page.locator("#delete-modal")).not.toBeVisible();
    await page
      .locator("tbody")
      .nth(0)
      .locator(".remove-from-list")
      .nth(1)
      .click();
    await expect(page.locator("#delete-modal")).toBeVisible();
  });

  test("The correct amount of column headers loaded", async ({ page }) => {
    await expect(page.locator("thead").locator("th")).toHaveCount(6);
  });
});
