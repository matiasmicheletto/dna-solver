const express = require("express");
const cors = require("cors");
const path = require("path");
const serveIndex = require('serve-index');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;    
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    // Serve app build folder
    this.app.use(express.static(path.join(__dirname, "../client/build")));
    // Serve examples files and directories
    this.app.use('/examples', serveIndex(path.join(__dirname, "../examples")));
    this.app.use('/examples', express.static(path.join(__dirname, "../examples")));
  }

  routes() {    
    this.app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port: ", this.port);
    });
  }
}

module.exports = Server;