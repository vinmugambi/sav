import * as Sentry from "@sentry/remix";

Sentry.init({
    dsn: "https://040ac451e718cb86335bcbe689544b60@o4508386322415616.ingest.de.sentry.io/4508386322808912",
    tracesSampleRate: 1,
    autoInstrumentRemix: true
})