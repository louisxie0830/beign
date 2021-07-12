// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-url': {},
        // to edit target browsers: use "browserslist" field in package.json
        autoprefixer: {
            browsers: [
                'Explorer >= 11',
                'iOS >= 10',
                'Android >= 6',
                'Chrome >= 52',
                'FireFox >= 44',
                'Safari >= 7',
                'Explorer 11',
                'last 4 Edge versions'
            ]
        }
    }
};
