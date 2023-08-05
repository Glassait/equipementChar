require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{html,ts}'],
    theme: {
        colors: {
            primary_light: '#FFFFFF',
            secondary_light: '#000000',
            background_light: '#E9E9E9',
            primary_dark: '#000000',
            secondary_dark: '#FFFFFF',
            background_dark: '#202020',
            hover_background_dark: '#161616',
            ok: '#51E839',
            ko: '#EE1E1E',
            linkLight: '#0500FF',
            linkDark: '#908DFF',
        },
        screens: {
            tablette: '768px',
            desktop: '1440px',
        },
        fontSize: {
            petit: ['16px'],
            normal: ['20px'],
            title: ['25px'],
        },
        fontFamily: {
            ui: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto",
        },
        sepia: {
            white: '100%',
            black: '94%',
        },
        brightness: {
            white: '0',
            black: '0',
        },
        hueRotate: {
            white: '164deg',
            black: '57deg',
        },
        invert: {
            white: '100%',
            black: '0',
        },
        saturate: {
            white: '100%',
            black: '100%',
        },
        contrast: {
            white: '101%',
            black: '105%',
        },
    },
    plugins: [
        require('tailwindcss'),
        require('@tailwindcss/container-queries'),
        require('prettier-plugin-tailwindcss'),
        require('autoprefixer'),
    ],
};
