declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.module.scss' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.module.sass' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.module.less' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.css' {
    const src: string;
    export default src;
}

declare module '*.scss' {
    const src: string;
    export default src;
}

declare module '*.sass' {
    const src: string;
    export default src;
}

declare module '*.less' {
    const src: string;
    export default src;
}
