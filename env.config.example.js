module.exports = {
    copy: {
        paths: [
            ['build/js', 'local/templates/main/js'],
            ['build/css', 'local/templates/main/css']
        ],
        options: {
            clean: true
        }
    }
}
