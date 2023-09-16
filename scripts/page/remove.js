const fs = require('fs');
const path = require('path');
const colors = require('colors');
const rimraf = require('rimraf');

const args = process.argv;
const pageName = args[2];

const pageListPath = path.join('scripts', 'page', 'pages.txt');

try {
    if (!pageName) throw new Error('Введите название страницы');

    const pages = fs.readdirSync(path.join('src', 'pages'));
    if (pages.findIndex((component) => component === pageName) === -1)
        throw new Error('Страницы не существует');

    const folderPath = path.join('src', 'pages', pageName);

    rimraf(folderPath, (err) => {
        if (err) throw new Error(err.message);
        console.log(`[ ${colors.green.bold('SUCCESS')} ] Страница ${pageName} удалена`);
        fs.writeFileSync(pageListPath, fs.readFileSync(pageListPath, {encoding: 'utf-8', flag: 'a+'}).replace(`${pageName}\n`, ''), {encoding: 'utf-8', flag: 'w'});
    });
} catch (e) {
    console.log(`[ ${colors.red.bold('ERROR')} ] ${e.message}`);
} finally {
}
