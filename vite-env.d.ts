/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BUBBLE_API_TOKEN: string
    readonly VITE_GEMINI_API_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
