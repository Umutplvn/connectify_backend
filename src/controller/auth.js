"use strict";

const express = require("express");
const Token = require("../models/token");
const User = require("../models/users");
const passwordEncrypt = require("../helpers/passwordEncrypt.js");

module.exports = {
  login: async (req, res) => {
    const { password, name } = req.body;
    if (password && name) {
     
      const user = await User.findOne({ name: name, password: password });

      if (user) {
        const tokenData ="Token "+passwordEncrypt(user._id+`${new Date()}`);
        
        await Token.create({ userId: user._id, token: tokenData });

        res.status(200).send({
            error: false,
            result:user,
            Token: tokenData,   
        });
      } else {
        res.errorStatusCode = 401;
        throw new Error("Login parameters are not true.");
      }
    } else {
      res.errorStatusCode = 400;
      throw new Error("Email and Password are required.");
    }
  },

  logout: async (req, res) => {
    const token =await req.headers?.authorization || null;
    let message = "";

    if (token) {
      const deletedToken = await Token.deleteOne({ token: token });
      message= "Successfully logged out. ";
    } else {
      message= "Logout failed.";
    }

    res.status(200).send({
      error: false,
      message: message,
    });
  },
};
