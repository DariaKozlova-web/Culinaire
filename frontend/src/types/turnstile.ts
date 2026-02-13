export interface TurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  theme?: "light" | "dark" | "auto";
}

export interface TurnstileInstance {
  render: (
    container: string | HTMLElement,
    options: TurnstileOptions,
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
  getResponse: (widgetId: string) => string;
}
