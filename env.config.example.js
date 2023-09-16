module.exports = {
    copy: {
        paths: [
            ['build/js', 'local/templates/main/js'],
            ['build/css', 'local/templates/main/css']
        ],
        options: {
            clean: true
        }
    },
    devServer: {
        port: 3000,
        middleware: {
            delayMS: 3000,
            basePath: './src/assets/mock-api',
            baseRoute: '/mock-api'
        }
    }
}
