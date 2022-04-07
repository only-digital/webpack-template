const fs = require('fs');
const path = require('path');

const componentsPath = path.join('src', 'components');

const pugTemplate = fs
    .readdirSync(componentsPath, 'utf-8')
    .reduce((str, val) => (str += `include ../../components/${val}/${val}\n`), '');
console.log(pugTemplate);
