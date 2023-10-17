module.exports = {
    globDirectory: "./",
    globPatterns: ["**/*.{wav,mp3,gif,WAV,png,webp,otf,jpg,js,json,css,html}"],
    swDest: "sw.js",
    swSrc: "sw-src.js",
    globIgnores:[
        "audio/**/*", 
        "node_modules/**/*",
        "data/**/*",
        "src/**/*",
        "workbox-config.js",
        "sw-src.js",
        "tsconfig.json",
        "webpack.config.js",
        "package.json",
        "package-lock.json",
        "README.md",
        "workbox-7f917042.js",
        "workbox-7f917042.js.map",
        "stats.json"
    ],
};