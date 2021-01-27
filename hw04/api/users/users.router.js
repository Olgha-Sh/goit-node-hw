const { Router } = require("express");
const { authorize } = require("../auth/auth.controller");
const { getLoggedUser } = require("./users.controller");

const router = Router();

router.get("/current", authorize, getLoggedUser);

exports.usersRouter = router;
