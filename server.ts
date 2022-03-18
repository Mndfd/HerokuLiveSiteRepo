import http from 'http';
import fs from 'fs';
import url from 'url';
import mime from 'mime-types';

const hostname: string = 'localhost';
const port: number = 3000;
let lookup = mime.lookup; // alias for mime.lookup

// create a server object (Immutable)
const server = http.createServer((req, res) => 
{
  let parsedURL = new URL(req.url as string, "http://" + hostname + ":" + port);
  let path = parsedURL.pathname.replace(/^\/+|\/+$/g, "");

  if (path == "") {
    path = "index.html";
  }

  let file = __dirname + "\\" + path;

  fs.readFile(file, function (err, content) {
    if (err) 
    {
      res.writeHead(404); // file not found
      res.end(JSON.stringify(err));
      return;
    }
    res.setHeader("X-Content-Type-Options", "nosniff");
    let mimeType = lookup(path) as string;
    res.writeHead(200, "", { "Content-Type": mimeType });
    res.end(content);
  });
});

// creating an event listener
server.listen(port, hostname, function() 
{
  console.log(`Server running at http://${hostname}:${port}/`);
});

