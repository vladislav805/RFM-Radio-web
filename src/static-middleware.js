const path = require('path');
const fs = require('fs');
const templater = require('./templater');
const detect = require('./locale/detect');

const PUBLIC_ROOT = path.resolve(process.cwd(), 'public');

const tryFiles = (requestedPath, req, res) => {
    // If exists (we need this file)
    if (!fs.existsSync(requestedPath)) {
        if (fs.existsSync(requestedPath + '.html')) {
            return tryFiles(requestedPath + '.html', req, res);
        }
        return false;
    }

    // If directory (we need index.html)
    if (fs.lstatSync(requestedPath).isDirectory()) {
        // %PUBLIC_ROOT%/ + index.html => %PUBLIC_ROOT%/index.html

        return tryFiles(path.resolve(requestedPath, 'index.html'), req, res);
    }

    if (requestedPath.endsWith('.html')) {
        const language = detect(req);
        res.setHeader('Content-type', 'text/html; charset=utf-8');

        const html = fs.readFileSync(requestedPath, {
            encoding: 'utf-8',
        });

        res.send(templater(html, language));
    } else {
        fs.createReadStream(requestedPath).pipe(res);
    }

    return true;
};

module.exports = (req, res, next) => {
    // ./
    const requestedPath = '.' + req.path;

    // %PUBLIC_ROOT% + ./ => %PUBLIC_ROOT%/
    let staticFilePath = path.resolve(PUBLIC_ROOT, requestedPath);

    if (tryFiles(staticFilePath, req, res)) {
        return;
    }

    return next();
};

module.exports.defaultRoute = (req, res) => {
    fs.createReadStream(path.resolve(PUBLIC_ROOT, '404.html')).pipe(res);
};
