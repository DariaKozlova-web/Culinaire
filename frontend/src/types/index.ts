import type { TurnstileInstance } from "@/types/turnstile";

declare global {
  interface Window {
    turnstile?: TurnstileInstance;
  }
}
