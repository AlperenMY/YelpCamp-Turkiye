const express = require("express");

const { User } = require("../models/user");

const authRouter = express.Router();

authRouter.get("/register", (req, res) => {
  res.render("auth/register", { title: "Register" });
});

authRouter.post("/register", async (req, res) => {
  res.send(req.body);
});

exports.authRouter = authRouter;
