import { defineConfig } from "vite";
import path, { resolve } from "node:path";
import * as glob from "glob";

import HtmlCssPurgePlugin from "vite-plugin-purgecss";
import HandlebarsPlugin from "vite-plugin-handlebars";


function obtenerHtmlFiles() {
    return Object.fromEntries(
        glob.sync(
            './**/*.html',
            {
                ignore: [
                    './dist/**',
                    './node_modules/**'
                ]
            }
        ).map((file) => {
            return [
                // Esto hace que index.html sea 'index' y html/galeria.html sea 'html/galeria'
                file.replace(/\.html$/, ""),
                resolve(__dirname, file)
            ];
        })
    );
}

export default defineConfig({
    appType: 'mpa',
    // Esto usa la variable de GitHub o la raíz en local
    base: process.env.DEPLOY_BASE_URL ?? '/PW2OpvDRYWALL1/', 
    
    build: {
        cssCodeSplit: false, // Mantenemos tu preferencia de un solo CSS
        rollupOptions: {
            input: obtenerHtmlFiles(),
        }
    },
    plugins: [
        HandlebarsPlugin({
            // Cambié 'components' por tu carpeta 'partials' para que te funcione
            partialDirectory: resolve(__dirname, 'partials'),
            /* context: (page) => {
                return typeof getData === 'function' ? getData(page) : {};
            } 
            */
        }),
        HtmlCssPurgePlugin({
            content: [
                './index.html',
                './html/**/*.html',
                './partials/**/*.hbs', // Para que no borre el diseño del header
                './src/**/*.js'
            ]
        }),
    ]
});