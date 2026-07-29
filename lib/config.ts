export type Config = {
  sentryDsn: string;
};

const config: Config = {
  sentryDsn: process.env.SENTRY_DSN ?? "",
};

export default config;
