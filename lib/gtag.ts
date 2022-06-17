import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
const session = useSession();

useEffect(() => {
  if (session.status === "authenticated") {
    event({
      action: "login",
      category: "user",
      label: session?.data.user?.email,
      value: new Date().getTime(),
    });
    set(session.data.user.email);
  }
}, [session]);

export const GA_TRACKING_ID = process.env
  .NEXT_PUBLIC_GOOGLE_ANALYTICS as string;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const set = (userId) => {
  window.gtag("set", { userId });
};
