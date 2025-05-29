interface ImportMetaEnv {
  readonly VITE_API_ORIGIN: string;
  readonly VITE_SESSION_TOKEN_KEY: string;
  readonly VITE_UNDOABLE_TIMEOUT_MS: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}