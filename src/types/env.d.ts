/// <reference types="umi" />

declare namespace NodeJS {
  interface ProcessEnv {
    VITE_API_PREFIX: string
    VITE_API_BASE_URL: string
    VITE_BASE: string
    VITE_CLIENT_ID: string
    VITE_APP_SETTING: string
  }
}
