exports.getLoggedUser = (req, res, _) => {
  const { email, id, subscription, token } = req.user;
  res.status(200).json({
    id,
    email,
    subscription,
    token,
  });
};
