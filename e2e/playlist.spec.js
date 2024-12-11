import { test, expect } from "@playwright/test";

test.describe("Playlist create tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/playlist/create");
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
    await page.route("**/slides*", async (route) => {
      const json = {
        "@context": "/contexts/Slide",
        "@id": "/v2/slides",
        "@type": "hydra:Collection",
        "hydra:member": [],
        "hydra:totalItems": 100,
      };
      await route.fulfill({ json });
    });
    await expect(page).toHaveTitle(/OS2Display admin/);
    await page.getByLabel("Email").fill("johndoe@example.com");
    await page.getByLabel("Kodeord").fill("password");
    await page.locator("#login").click();
  });

  test("It loads create playlist page", async ({ page }) => {
    await expect(page.locator("#save_playlist")).toBeVisible();
  });

  test("It redirects on save", async ({ page }) => {
    await page.route("**/playlists", async (route) => {
      const json = {
        title: "A laudantium aspernatur qui.",
        description: "Description",
        created: "1991-09-10T22:36:56+02:00",
        modified: "2021-12-09T12:01:33+01:00",
        modifiedBy: "",
        createdBy: "",
      };
      await route.fulfill({ json });
    });

    // Displays success toast and redirects
    await expect(
      page.locator(".Toastify").locator(".Toastify__toast--success")
    ).not.toBeVisible();
    await page.locator("#save_slide_and_close").click();
    await expect(
      page
        .locator(".Toastify")
        .locator(".Toastify__toast--success")
        .getByText(/gemt/)
        .first()
    ).toBeVisible();
    await expect(page).toHaveURL(/playlist\/list/);
  });

  test("It display error toast on save error", async ({ page }) => {
    await page.route("**/playlists", async (route) => {
      const json = {
        "@context": "/contexts/Error",
        "@type": "hydra:Error",
        "hydra:title": "An error occurred",
        "hydra:description": "An error occurred",
      };
      await route.fulfill({ status: 500, json });
    });

    // Displays error toast and stays on page
    await expect(
      page.locator(".Toastify").locator(".Toastify__toast--error")
    ).not.toBeVisible();
    await page.locator("#save_playlist").click();
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
    await expect(page).toHaveURL(/playlist\/create/);
  });

  test("It cancels create playlist", async ({ page }) => {
    await expect(page.locator("#cancel_playlist")).toBeVisible();
    await page.locator("#cancel_playlist").click();
    await expect(page.locator("#cancel_playlist")).not.toBeVisible();
  });
});

test.describe("Playlist list tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/playlist/list");
    await page.route("**/playlists*", async (route) => {
      const json = {
        "@context": "/contexts/Playlist",
        "@id": "/v2/playlists",
        "@type": "hydra:Collection",
        "hydra:member": [
          {
            "@type": "Playlist",
            "@id": "/v2/playlists/004ZP1XQ1G1MVZ1T0100YN0MPC",
            title: "Et consequatur voluptatibus dolore ut ut.",
            description:
              "Atque maiores nam in occaecati labore labore inventore quo. Enim nemo totam hic. Ut suscipit id sint sed quia.",
            schedules: [],
            created: "1975-06-08T13:12:49.000Z",
            modified: "2022-01-30T15:42:42.000Z",
            modifiedBy: "",
            createdBy: "",
            slides: "/v2/playlists/004ZP1XQ1G1MVZ1T0100YN0MPC/slides",
            campaignScreens: ["/v2/screens/00TH1ZRMZC141K1DMB1H7J03CS"],
            campaignScreenGroups: [],
            isCampaign: true,
            published: {
              from: "2022-03-23T21:30:21.000Z",
              to: "2022-03-25T12:39:29.000Z",
            },
          },
          {
            "@type": "Playlist",
            "@id": "/v2/playlists/007TM6JDGF1ECH07J10ZHY0S7P",
            title: "Voluptas molestias nemo et.",
            description:
              "Aperiam quam sunt quia qui. Iusto ut deserunt veritatis nobis dolorem. Aliquid quo vel quia.",
            schedules: [],
            created: "1978-07-12T17:43:59.000Z",
            modified: "2022-01-30T15:42:42.000Z",
            modifiedBy: "",
            createdBy: "",
            slides: "/v2/playlists/007TM6JDGF1ECH07J10ZHY0S7P/slides",
            campaignScreens: [],
            campaignScreenGroups: [
              "/v2/screen-groups/00EQWMS5WA1WJE0WD81VF91DFH",
              "/v2/screen-groups/0135RY0QPR1DVF0ZT70YHS1NX3",
              "/v2/screen-groups/0135RY0QPR1DVF0ZT70YHS1NX3",
            ],
            isCampaign: false,
            published: {
              from: "2021-03-21T02:10:37.000Z",
              to: "2021-11-08T12:13:31.000Z",
            },
          },
        ],
        "hydra:totalItems": 10,
      };
      await route.fulfill({ json });
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
    await page.route("**/slides*", async (route) => {
      const json = {
        "@context": "/contexts/Slide",
        "@id": "/v2/slides",
        "@type": "hydra:Collection",
        "hydra:member": [],
        "hydra:totalItems": 100,
      };
      await route.fulfill({ json });
    });
    await expect(page).toHaveTitle(/OS2Display admin/);
    await page.getByLabel("Email").fill("johndoe@example.com");
    await page.getByLabel("Kodeord").fill("password");
    await page.locator("#login").click();
  });

  test("It loads playlist list", async ({ page }) => {
    await expect(
      page.locator("table").locator("tbody").first()
    ).not.toBeEmpty();
    await expect(page.locator("tbody").locator("tr td").first()).toBeVisible();
  });

  test("It goes to edit", async ({ page }) => {
    await page.route("**/playlists/*", async (route) => {
      const json = {
        "@id": "/v2/playlists/004ZP1XQ1G1MVZ1T0100YN0MPC",
        title: "Et consequatur voluptatibus dolore ut ut.",
        description:
          "Atque maiores nam in occaecati labore labore inventore quo. Enim nemo totam hic. Ut suscipit id sint sed quia.",
        schedules: [],
        created: "1975-06-08T13:12:49.000Z",
        modified: "2022-01-30T15:42:42.000Z",
        modifiedBy: "",
        createdBy: "",
        slides: "/v2/playlists/004ZP1XQ1G1MVZ1T0100YN0MPC/slides",
        campaignScreens: ["/v2/screens/00TH1ZRMZC141K1DMB1H7J03CS"],
        campaignScreenGroups: [],
        isCampaign: true,
        published: {
          from: "2022-03-23T21:30:21.000Z",
          to: "2022-03-25T12:39:29.000Z",
        },
      };

      await route.fulfill({ json });
    });

    await expect(page.locator("#playlistTitle")).not.toBeVisible();
    await page.locator("tbody").locator("tr td a").nth(0).click();
    await expect(page.locator("#playlistTitle")).toBeVisible();
  });

  test("The correct amount of column headers loaded (playlist list)", async ({
    page,
  }) => {
    await expect(page.locator("thead").locator("th")).toHaveCount(8);
  });
});
