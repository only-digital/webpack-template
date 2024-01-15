import fs from "fs";
import { Application } from 'express'
import path from "path";
import colors from "colors";

const config = {
    delayMS: 3000,
    baseRoute: '/mock-api',
    basePath: './src/assets/mock-api',
    port: 3000
}

if (fs.existsSync('env.config.js')) {
    const envConfig = require('../env.config').devServer || {};
    config.delayMS = envConfig.middleware?.delayMS || config.delayMS;
    config.basePath = path.format(path.parse(path.resolve(__dirname, '..', envConfig.middleware?.basePath || config.basePath)));
    config.baseRoute = envConfig.middleware?.baseRoute || config.baseRoute;
    config.port = envConfig.port || config.port;
}

const middlewares = ({ app: devServer }: { app: Application }) =>  {
    console.log(`\n[ ${colors.blue.bold('API')} ]`);
    if (!fs.existsSync(config.basePath)) {
        console.warn(colors.yellow(`Missing directory ${colors.blue(config.basePath)}\n`));
        return;
    }

    devServer.use(async(_req, _res, next) => {
        await new Promise((resolve) => setTimeout(resolve, config.delayMS));
        next();
    });

    fs.readdirSync(config.basePath, {withFileTypes: true}).forEach((file) => {
        if (!file.isFile()) return;

        const { status, body } = JSON.parse(fs.readFileSync(path.join(config.basePath, file.name), 'utf-8'));
        const apiRoute = path.join(config.baseRoute, file.name).replace(/\\/g, '/')

        devServer.use(apiRoute, (req, res) => {
            res.status(status);
            res.json({body: body});
        })

        console.log(`• http://localhost:${config.port}${apiRoute}`);
    })

    console.log('');
}

export default middlewares;
