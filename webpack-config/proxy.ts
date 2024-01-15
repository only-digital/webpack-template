import fs from 'fs';

const config = {
    baseRoute: '/mock-api',
}

if (fs.existsSync('env.config.js')) {
    const envConfig = require('../env.config').devServer || {};
    config.baseRoute = envConfig.middleware?.baseRoute || config.baseRoute;
}

const proxy = {
    '/': {
        bypass: (req: Request) => {
            if (!req.url.indexOf(config.baseRoute)) return null;
            return `${req.url.replace(/.html/g, '')}.html`
        }
    }
}

export default proxy;
