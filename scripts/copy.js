const fs = require('fs');
const path = require('path');
const colors = require('colors');

const config = {
    /**
     * @description Массив папок для копирования всех вложенных файлов и папок;
     * @description key - исходная директория,
     * @description value - целевая директория
     * @type {string[][] | Map<string, string>}
     */
    paths: [
        ['build/js', 'local/templates/main/js'],
        ['build/css', 'local/templates/main/css'],
    ],
    /**
     * @description Параметры для копирования;
     * @description clean - Очистка целевой директории перед копированием файлов
     * @type {{clean: boolean}}
     */
    options: {
        clean: true
    }
}

console.log(`${colors.blue.bold('Start copying files')}`);

if (fs.existsSync('env.config.js')) {
    console.log(`${colors.white('Using configuration from')} ${colors.white.bold('env.config.js')}`);
    const envConfig = require('../env.config').copy || {};
    config.paths = envConfig.paths || config.paths;
    Object.assign(config.options, envConfig.options)
} else {
    console.log(`${colors.white('Using default configuration')}`);
}
config.paths = new Map(config.paths)


function prepareTargetDirectory(src, target) {
    if (!fs.existsSync(target)) {
        console.log(`${colors.blue('--- Creating directory')} ${colors.cyan(target)}`);
        fs.mkdirSync(target, { recursive: true });
        return;
    }

    if (config.options.clean) {
        console.log(`${colors.blue('--- Cleaning directory')} ${colors.cyan(target)}`);
        fs.rmSync(target, { recursive: true });
        fs.mkdirSync(target);
    }
}

function copySrcToTarget(src, target) {
    if (fs.lstatSync(src).isDirectory()) {
        prepareTargetDirectory(src, target);
    }

    fs.readdirSync(src).forEach(function(fileName) {
        const fullSrc = path.join(src, fileName);
        const fullTarget = path.join(target, fileName);
        if (fs.lstatSync(fullSrc).isDirectory()) {
            copySrcToTarget(fullSrc, fullTarget);
        } else {
            fs.copyFileSync(fullSrc, fullTarget);
        }
    });
}

try {
    config.paths.forEach(function(targetDir, srcDir) {
        try {
            copySrcToTarget(srcDir, targetDir);
            console.log(`${colors.blue('Copying files from')} ${colors.cyan(srcDir)} ${colors.blue('to')} ${colors.cyan(targetDir)}`);
        } catch (e) {
            console.log(`${colors.red('Copying files from')} ${colors.bgRed(srcDir)} ${colors.red('to')} ${colors.bgRed(targetDir)} ${colors.red('failed with error')}`);
            throw new Error(e);
        }
    });
    console.log(colors.green.bold('All files successfully copied'));
} catch (e) {
    console.log(colors.red.bold(e.message));
}
