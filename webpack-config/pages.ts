import colors from 'colors';
import path from 'path';
import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config = {
    port: 3000
}

if (fs.existsSync('env.config.js')) {
    const envConfig = require('../env.config').devServer || {};
    config.port = envConfig.port || config.port;
}

const getPages = (): HtmlWebpackPlugin[] => {
    const viewsPath = path.join('src', 'pages');
    const views = fs.readdirSync(viewsPath);

    console.log(`[ ${colors.blue.bold('PAGES')} ]`);

    const pages = views.map((view) => {
        console.log(`• http://localhost:${config.port}/${view}${process.env.WEBPACK_SERVE ? '' : '.html'}`);
        return new HtmlWebpackPlugin({
            filename: `${view}.html`,
            template: `./src/pages/${view}/${view}.pug`,
        });
    });

    console.log('');

    return pages;
}

export default getPages;
