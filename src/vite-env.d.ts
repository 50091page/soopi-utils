/// <reference types="vite/client" />

type GtagConfigParams = {
  page_path?: string;
};

interface Window {
  dataLayer?: unknown[];
  gtag?: {
    (command: "js", date: Date): void;
    (command: "config", targetId: string, config?: GtagConfigParams): void;
  };
}
