/// <reference types="react" />

declare namespace JSX {
    interface IntrinsicElements {
        div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
        header: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        nav: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        main: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        aside: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        footer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
        input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
        span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    }
}