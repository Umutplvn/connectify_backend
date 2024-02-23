"use strict";

/*--------------------------------------*
Connectify
/*--------------------------------------*/

require("express-async-errors");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const User = require("../models/users");
const Token = require("../models/token");
const Chats = require("../models/chats");
const { ObjectId } = require("mongoose").Types;
const sendVerificationEmail = require("./emailVerification");

module.exports = {
  list: async (req, res) => {
    const data = await req.getModelList(User);

    res.status(200).send({
      error: false,
      count: data.length,
      result: data,
    });
  },

  create: async (req, res) => {
    let passcode = Math.floor(Math.random() * 10000) + 2000;
    const { email, password, name, username } = req.body;
    const upName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const user = await User.findOne({ username });
    const userEmail = await User.findOne({ email });

    if (user) {
      res
        .status(400)
        .send({ error: true, message: "Username has already been taken." });
      return;
    } else if (userEmail) {
      res
        .status(400)
        .send({ error: true, message: "The email address is already in use." });
      return;
    }

    const newUser = await User.create({ email, username, password, name });
    const tokenData = "Token " + passwordEncrypt(newUser._id + `${new Date()}`);
    await Token.create({ userId: newUser._id, token: tokenData });
    sendVerificationEmail(email, passcode, upName);

    res.status(201).send({
      error: false,
      result: newUser,
      Token: tokenData,
      passcode,
    });
  },

  read: async (req, res) => {
    const data = await User.findOne({ _id: req.params.userId });

    res.status(200).send({
      error: false,
      result: data,
    });
  },

  filterUser: async (req, res) => {
    const { username } = req.body;
    const regex = new RegExp(username, "i");
    const data = await User.find({
      username: { $regex: username, $options: "i" },
    });

    res.status(200).send({
      error: false,
      result: data,
    });
  },

  update: async (req, res) => {
    const userId = req.user;

    const updateData = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      updateData,
      { new: true, runValidators: true }
    );
    const tokenData = await Token.findOne({ userId: userId });

    const receiver = await Chats.find({ "toWho._id": userId });
    for (const chat of receiver) {
      chat.toWho = updatedUser; // Sender alanını güncelle
      await chat.save();
    }

    res.status(202).send({
      error: false,
      Token: tokenData.token,
      result: updatedUser,
    });
  },

  getMyContacts: async (req, res) => {
    const userId = req.user;
    const user = await User.findOne({ _id: userId });

    res.status(202).send({
      error: false,
      contacts: user.contacts,
    });
  },

  addcontact: async (req, res) => {
    const { contactId } = req.body;
    const userId = req.user;
    const user = await User.findOne({ _id: contactId });
    const existingUser = await User.findOne({ _id: userId });
    let contactExists = false;

    existingUser.contacts.forEach((contact) => {
      if (contact._id.toString() === contactId) {
        contactExists = true;
        return;
      }
    });

    if (!contactExists) {
      await User.updateOne({ _id: userId }, { $push: { contacts: user } });
    }
    const updatedUser = await User.findOne({ _id: userId });

    res.status(202).send({
      error: false,
      contacts: updatedUser.contacts,
    });
  },

  removecontact: async (req, res) => {
    const { contactId } = req.body;
    const userId = req.user;

    const user = await User.findOne({ _id: contactId });
    await User.updateOne({ _id: req.user }, { $pull: { contacts: user } });
    const updatedUser = await User.findOne({ _id: userId });

    if (
      !updatedUser.contacts.some(
        (contact) => contact._id.toString() === contactId
      )
    ) {
      return res.status(404).send({
        error: true,
        message: "Contact is not in the contacts list.",
      });
    }

    res.status(202).send({
      error: false,
      contacts: updatedUser.contacts,
    });
  },

  delete: async (req, res) => {
    const data = await User.deleteOne({ _id: req.params.userId });
    await Token.deleteOne({ userId: req.params.userId });
    if (data.deletedCount >= 1) {
      res.send({
        message: "Successfully deleted",
      });
    } else {
      res.send({
        message: "There is no recording to be deleted.",
      });
    }
  },

  updatePassword: async (req, res) => {
    const password = req.body.password;

    await User.updateOne(
      { _id: req.user },
      { password: password },
      {
        runValidators: true,
      }
    );
    const newData = await User.findOne({ _id: req.user });

    res.status(202).send({
      error: false,
      message: "Password has changed successfully.",
      result: newData,
    });
  },
};
