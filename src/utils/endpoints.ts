const getEnvironment = () => {
  const hostname = new URL(window.location.href).hostname;

  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) return "localhost";
  if (hostname.includes("staging")) return "staging";
  if (hostname.includes("qa")) return "qa";
  if (hostname.includes("uat")) return "uat";
  return "prod"; // Default to production if no specific environment is found
};

const config = {
  environments: ["localhost", "staging", "qa","uat", "prod"],
  urls: {
    n8n: {
      localhost: "https://elder-link-staging-n8n.fwoasm.easypanel.host/webhook/76c09305-9123-4cfb-831e-4bceaa51a561",
      staging: "https://elder-link-staging-n8n.fwoasm.easypanel.host/webhook/76c09305-9123-4cfb-831e-4bceaa51a561",
      qa: "https://elder-link-staging-n8n.fwoasm.easypanel.host/webhook/76c09305-9123-4cfb-831e-4bceaa51a561",
      uat: "https://elder-link-staging-n8n.fwoasm.easypanel.host/webhook/76c09305-9123-4cfb-831e-4bceaa51a561",
      prod: "https://n8n-pc98.onrender.com/webhook/76c09305-9123-4cfb-831e-4bceaa51a561",
    },
    api: {
    },
  },
};

const environment = getEnvironment();

const safeEnvironment = config.environments.includes(environment) ? environment : "prod";

// Export URLs based on the detected environment
export const n8nWebhookUrl = config.urls.n8n[safeEnvironment];
export const apiBaseUrl = config.urls.api[safeEnvironment];

// Export environment information
export const currentEnvironment = safeEnvironment;

export const endpoints = {
  n8n: {
    webhook: n8nWebhookUrl,
  },
  api: {
    baseUrl: apiBaseUrl,
  },
};
