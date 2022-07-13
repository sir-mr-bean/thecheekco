export const GA_TRACKING_ID = process.env
  .NEXT_PUBLIC_GOOGLE_ANALYTICS as string;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== "undefined") {
    (window as any).gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value: string;
}) => {
  if (typeof window !== "undefined") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const setUser = (userId: Gtag.CustomParams) => {
  if (typeof window !== "undefined") {
    window.gtag("set", { user_id: userId });
  }
};
