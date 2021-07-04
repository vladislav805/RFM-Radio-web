const fs = require('fs');

module.exports = {
    header: fs.readFileSync('public/_header.html', { encoding: 'utf-8' }),
    footer: fs.readFileSync('public/_footer.html', { encoding: 'utf-8' }),
};
