/// <reference types="vite/client" />

interface Window {
  backend?: unknown;
  wails?: unknown;
  runtime: {
    [key: string]: (...args: unknown[]) => unknown;
  };
}
