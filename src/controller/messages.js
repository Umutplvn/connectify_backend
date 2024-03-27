"use strict";

/*--------------------------------------*
Connectify
/*--------------------------------------*/

require("express-async-errors");
const Messages = require("../models/messages");
const Users = require("../models/users");
const Chats = require("../models/chats");

module.exports = {
  createMessage: async (req, res) => {
    const { chatId, text, messageId } = req.body;
    const senderId = req.user;

    const sender = await Users.findOne({ _id: senderId });
    const { _id, email, username, name } = sender;
    const replyto = await Messages.findOne({ _id: messageId });
    const message = await Messages.create({
      chatId,
      sender: { _id, email, username, name },
      text,
      replyto,
    });
    await Chats.updateOne(
      { _id: chatId },
      { show: true },
      { runValidators: true }
    );

    try {
      if (messageId) {
        const response = await message.save();
        res.status(200).send({
          error: false,
          response,
          replyto,
        });
      } else {
        const response = await message.save();
        res.status(200).send({
          error: false,
          response,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  getMessages: async (req, res) => {
    const { chatId } = req.params;
    try {
      const messages = await Messages.find({ chatId: chatId });
      res.status(200).send(messages);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  favMessage: async (req, res) => {
    const { info } = req.body;

    try {
      const user = await Users.findOne({ _id: req.user });
      const check = user.favMessages.filter(
        (item) => item?.info?._id == info?._id
      );
      if (check.length > 0) {

        await Users.updateOne(
          { _id: req.user },
          { $pull: { favMessages: { info } } }
        );
        const data = await Users.findOne({ _id: req.user });
        res.status(200).send({
          response:data.favMessages,
          message:"The message has been removed from favorites."
        });

      } else {
        await Users.updateOne(
          { _id: req.user },
          { $push: { favMessages: { info } } }
        );
        const data = await Users.findOne({ _id: req.user });
        res.status(200).send({
          response:data.favMessages,
          message:"The message has been added to favorites."
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  addReaction: async (req, res) => {
    const { messageId } = req.body;
    const { reaction } = req.body;
    const val = await Messages.findOne({ _id: messageId });

    try {
      await Messages.updateOne(
        { _id: messageId },
        { reaction: reaction },
        {
          runValidators: true,
        }
      );

      const upMessage = await Messages.findOne({ _id: messageId });
      res.status(200).send(upMessage);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  deleteMessage: async (req, res) => {
    const userId=req.user
    const user = await Users.findOne({_id:userId})
    user.favMessages = user.favMessages.filter(item => item.info._id !== req.params.messageId);
    await user.save();

    const data = await Messages.updateOne({ _id: req.params.messageId }, { sender:"",
      text:"This message was deleted.",
      reaction:"",
      replyto:""
    });

      const message= await Messages.findOne({_id: req.params.messageId})

      res.send(message);
  

  },
};
