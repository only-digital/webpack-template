import path from 'path';
import fs from 'fs';
import colors from 'colors';

const createDataJson = (): string => {
    const dataPath = path.join('src', 'assets', 'data');
    let dataJson = '';
    try {
        dataJson = JSON.parse(fs.readdirSync(dataPath).reduce((prev: string, current: string, index: number) => {
            if (!~current.indexOf('.json')) {
                throw new Error('Неверное расширение файла');
            }

            const fileName = current.slice(0, current.indexOf('.json'));

            try {
                prev += `${index === 0 ? '' : ','}"${fileName}": ${fs.readFileSync(path.join(dataPath, current))}`;
                return prev;
            } catch (e) {
                if (e instanceof Error) console.log(`[ ${colors.red.bold('ERROR')} ] ${colors.bold(current)}: ${e.message}`);
            }
            return '';
        }, '{') + '}');
    } catch (e) {
        if (e instanceof Error) console.log(`[ ${colors.red.bold('ERROR')} ] ${e.message}`);
    }
    return dataJson;
}

export default createDataJson;
