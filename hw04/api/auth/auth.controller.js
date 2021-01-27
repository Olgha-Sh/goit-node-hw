const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { UserModel } = require("../users/users.model");

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res
        .status(409)
        .json({ message: `User with ${email} email already exists.` });
    }
    const passwordHash = await bcryptjs.hash(
      password,
      Number(process.env.HASH_POWER)
    );
    const newUser = await UserModel.create({
      email,
      password: passwordHash,
      token: "",
    });
    res.status(201).json({
      id: newUser._id,
      email,
      subscription: newUser.subscription,
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(403)
        .json({ message: `User with ${email} email doesn't exist.` });
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Password is wrong." });
    }
    const newToken = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    await UserModel.findByIdAndUpdate(user._id, {
      token: newToken,
    });
    res.status(200).json({
      id: user._id,
      email,
      subscription: user.subscription,
      token: newToken,
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const loggedUser = req.user;
    await UserModel.findByIdAndUpdate(loggedUser._id, { token: "" });
    req.user = null;
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

async function authorize(req, res, next) {
  const authorizationHeader = req.get("Authorization");
  if (authorizationHeader) {
    const token = authorizationHeader.replace("Bearer ", "");
    let uid;
    try {
      uid = jwt.verify(token, process.env.JWT_SECRET).uid;
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await UserModel.findById(uid);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } else res.status(401).json({ message: "Unauthorized" });
}

async function updateSubscription(req, res, next) {
  try {
    const availableSubscriptions = ["free", "pro", "premium"];
    const loggedUser = req.user;
    const { requestedSubscription } = req.body;
    if (availableSubscriptions.includes(requestedSubscription)) {
      await UserModel.findByIdAndUpdate(loggedUser._id, {
        subscription: requestedSubscription,
      });
      res.status(200).json({
        id: loggedUser._id,
        email: loggedUser.email,
        subscription: requestedSubscription,
        token: loggedUser.token,
      });
      req.user.subscription = requestedSubscription;
    } else {
      res.status(400).json({
        message: "Please, choose a valid subscription: free, pro, premium.",
      });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  authorize,
  logout,
  updateSubscription,
};
