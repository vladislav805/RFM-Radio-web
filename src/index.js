const restana = require('restana');
const staticMiddleware = require('./static-middleware');
const api = require('./api');

const server = restana({
    defaultRoute: staticMiddleware.defaultRoute,
});

server.use(staticMiddleware);
server.get('/api/releases', api.releases);

server.start(7128);
