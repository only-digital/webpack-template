import colors from 'colors';
import path from 'path';
import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const getPages = (): HtmlWebpackPlugin[] => {
    const viewsPath = path.join('src', 'pages');
    const views = fs.readdirSync(viewsPath);

    console.log(`[ ${colors.blue.bold('PAGES')} ]`);

    const pages = views.map((view) => {
        console.log(`• http://localhost:3000/${view}`);
        return new HtmlWebpackPlugin({
            filename: `${view}.html`,
            template: `./src/pages/${view}/${view}.pug`,
        });
    });

    console.log('');

    return pages;
}

export default getPages;
