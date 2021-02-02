const { Router } = require("express");
const Joi = require("joi");
const {
  register,
  login,
  authorize,
  logout,
  updateSubscription,
} = require("./auth.controller");
const { validate } = require("../helpers/validate");

const router = Router();

const signInOrUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post("/register", validate(signInOrUpSchema), register);
router.post("/login", validate(signInOrUpSchema), login);
router.post("/logout", authorize, logout);
router.patch("/", authorize, updateSubscription);

exports.authRouter = router;
