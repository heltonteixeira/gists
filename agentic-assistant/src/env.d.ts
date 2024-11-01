/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
}
