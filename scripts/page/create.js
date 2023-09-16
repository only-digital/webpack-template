const fs = require('fs');
const path = require('path');
const colors = require('colors');

const args = process.argv;
const pageName = args[2];
const pageTitle = args[3];


const progressLog = (text) => console.log(`[ ${colors.blue.bold('PROGRESS')} ] ${text}`);
const pathFileExt = (path, ext) => `${path}.${ext}`;

const pageListPath = path.join('scripts', 'page', 'pages.txt');


try {
    if (!pageName) throw new Error('Введите название страницы');
    if (!pageTitle) throw new Error('Введите заголовок страницы');

    const pages = fs.readdirSync(path.join('src', 'pages'));
    if (pages.findIndex((component) => component === pageName) !== -1)
        throw new Error('Страница уже существует');

    const folderPath = path.join('src', 'pages', pageName);
    const filePath = path.join(folderPath, pageName);

    fs.mkdir(folderPath, {}, (err) => {
        if (err) throw new Error(err.message);
        progressLog('Директория успешно создана');

        const pugPath = pathFileExt(filePath, 'pug');
        fs.writeFile(
            pugPath,
            `extends ../../app/pug/layout\n\nblock title\n    | ${pageTitle}\n\nblock content\n    div(data-barba="container" data-barba-namespace="common" data-page-namespace="${pageName}").content-wrapper\n        h1 ${pageName}\n\n`,
            (err) => {
                if (err) throw new Error(err.message);
                progressLog(`Генерация ${pageName}.pug`);

                fs.appendFileSync(pageListPath, `${pageName}\n`, {encoding: 'utf-8', flag: 'a+'});
                console.log(`[ ${colors.green.bold('SUCCESS')} ] Страница ${pageName} создана`);
            }
        );
    });
} catch (e) {
    console.log(`[ ${colors.red.bold('ERROR')} ] ${e.message}`);
}
