import http from 'http';
import { PageTemplate } from './PageTemplate.js';
import { utils } from './utils.js';
import { PageHome } from '../pages/PageHome.js';
import {page404} from '../pages/page404.js';
import {pageLogin} from '../pages/PageLogin.js';
import {pageRegister} from '../pages/PageRegister.js';

const server = {};

server.httpServer = http.createServer((req, res) => {
    const baseURL = `http${req.socket.encryption ? 's' : ''}://${req.headers.host}`;
    const parsedURL = new URL(req.url, baseURL);
    const httpMethod = req.method.toLowerCase();
    const parsedPathName = parsedURL.pathname;
    const trimmedPath = parsedPathName.replace(/^\/+|\/+$/g, '');
    const header = req.headers;

    req.on('data', () => {
        console.log('Klientas atsiunte duomenu...');
    })

    req.on('end', () => {
        // tekstiniai failai:
        //   - css
        //   - js
        //   - svg
        // binary failai:
        //   - png/jpg/ico
        //   - woff, ttf
        //   - mp3, exe
        // API (www.psl.com/api/....)
        // puslapio HTML

        const fileExtension = utils.fileExtension(trimmedPath);

        const textFileExtensions = ['css', 'js', 'svg'];
        const binaryFileExtensions = ['png', 'jpg', 'ico', 'eot', 'ttf', 'woff', 'woff2', 'otf'];
        
        const isTextFile = textFileExtensions.includes(fileExtension);
        const isBinaryFile = binaryFileExtensions.includes(fileExtension);
        const isAPI = trimmedPath.split('/')[0] === 'api';
        const isPage = !isTextFile && !isBinaryFile && !isAPI;

        let responseContent = '';

        if (isTextFile) {
            responseContent = 'TEXT FILE CONTENT';
        }

        if (isBinaryFile) {
            responseContent = 'BINARY FILE CONTENT';
        }

        if (isAPI) {
            responseContent = 'API CONTENT';
        }

        if (isPage) {
        
            const pageClass = server.routes [trimmedPath]
                ? server.routes [trimmedPath]
                : server.routes ['404'];
            const pageObj = new pageClass ();

            responseContent = pageObj.render();
        }

        res.end(responseContent);
    })
});

server.routes = {
    '': PageHome,
    '404': page404,
    'register': pageRegister,
    'login': pageLogin,
  
}

server.init = () => {
    const port = 3000;
    server.httpServer.listen(port, () => {
        console.log(`Tavo serveris sukasi ant http://localhost:${port}`);
    });
}

export { server }