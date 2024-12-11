let configData = null;
let activePromise = null;

const ConfigLoader = {
  async loadConfig() {
    if (activePromise) {
      return activePromise;
    }

    activePromise = new Promise((resolve) => {
      if (configData !== null) {
        resolve(configData);
      } else {
        fetch("/admin/config.json")
          .then((response) => response.json())
          .then((data) => {
            configData = data;
            resolve(configData);
          })
          .catch(() => {
            if (configData !== null) {
              resolve(configData);
            } else {
              // eslint-disable-next-line no-console
              console.error(
                "Could not load config.json. Will use default config."
              );

              // Default config.
              resolve({
                api: "/api/",
                touchButtonRegions: false,
                preview: null,
                loginMethods: [
                  {
                    type: "oidc",
                    enabled: true,
                    provider: "internal",
                    label: null,
                    icon: null,
                  },
                  {
                    type: "oidc",
                    enabled: true,
                    provider: "external",
                    label: null,
                    icon: null,
                  },
                  {
                    type: "username-password",
                    enabled: true,
                    provider: "username-password",
                    label: null,
                    icon: null,
                  },
                ],
              });
            }
          })
          .finally(() => {
            activePromise = null;
          });
      }
    });

    return activePromise;
  },
};

Object.freeze(ConfigLoader);

export default ConfigLoader;
