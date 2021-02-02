const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const { contactsRouter } = require("../contacts/contacts.router");
const { usersRouter } = require("../users/users.router");
const { authRouter } = require("../auth/auth.router");

exports.CRUDServer = class CRUDServer {
  constructor() {
    this.app = null;
  }

  async start() {
    this.initServer();
    await this.initDbConnection();
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandling();
    this.initListening();
  }

  initServer() {
    this.app = express();
  }

  async initDbConnection() {
    mongoose.set("useCreateIndex", true);
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
      console.log("Database connection successful");
    } catch (err) {
      // process.exit(1);
    }
  }

  initMiddlewares() {
    this.app.use(express.json());
  }

  initRoutes() {
    this.app.use("/api/contacts", contactsRouter);
    this.app.use("/users", usersRouter);
    this.app.use("/auth", authRouter);
  }

  initErrorHandling() {
    this.app.use((err, req, res, next) => {
      const status = err.status || 500;
      return res.status(status).json(err.message);
    });
  }

  initListening() {
    this.app.listen((process.env.PORT = 3002), () => {
      console.log("Started listening on port", process.env.PORT);
    });
  }
};
