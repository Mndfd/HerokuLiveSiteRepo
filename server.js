"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = __importDefault(require("mime-types"));
const hostname = 'localhost';
const port = 3000;
let lookup = mime_types_1.default.lookup;
const server = http_1.default.createServer((req, res) => {
    let parsedURL = new URL(req.url, "http://" + hostname + ":" + port);
    let path = parsedURL.pathname.replace(/^\/+|\/+$/g, "");
    if (path == "") {
        path = "index.html";
    }
    let file = __dirname + "\\" + path;
    fs_1.default.readFile(file, function (err, content) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.setHeader("X-Content-Type-Options", "nosniff");
        let mimeType = lookup(path);
        res.writeHead(200, "", { "Content-Type": mimeType });
        res.end(content);
    });
});
server.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});
//# sourceMappingURL=server.js.map