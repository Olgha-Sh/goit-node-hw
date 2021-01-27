const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../../.env") });
const { contactsRouter } = require("../contacts/contacts-router");

exports.CRUDServer = class CRUDServer {
  constructor() {
    this.app = null;
  }

  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandling();
    this.initListening();
  }

  initServer() {
    this.app = express();
  }

  initMiddlewares() {
    this.app.use(express.json());
  }

  initRoutes() {
    this.app.use("/api/contacts", contactsRouter);
  }

  initErrorHandling() {
    this.app.use((err, req, res, next) => {
      const status = err.status || 500;
      return res.status(status).send(err.message);
    });
  }

  initListening() {
    this.app.listen((process.env.PORT = 3002), () => {
      console.log("Started listening on port", process.env.PORT);
    });
  }
};
