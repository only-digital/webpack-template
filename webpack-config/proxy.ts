import path from 'path';
import fs from 'fs';

type TProxy = {
    [key in string]: {
        target: string;
        pathRewrite: Record<string, string>
    }
}

const getProxy = (): TProxy => {
    const viewsPath = path.join('src', 'pages');
    const views = fs.readdirSync(viewsPath);

    const proxy: TProxy = {};
    views.forEach((view) => {
        proxy[`/${view}`] = {
            target: `http://localhost:3000/${view}.html`,
            pathRewrite: { [`^/${view}`]: '' }
        }
    });

    return proxy;
}

export default getProxy;
