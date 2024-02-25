"use strict";

/*--------------------------------------*
Connectify
/*--------------------------------------*/

require("express-async-errors");
const Notes = require("../models/notes");
const Users = require("../models/users");

module.exports = {
  createNote: async (req, res) => {
    const { content } = req.body;
    const userId = req.user;

    const note = await Notes.create({ userId, content });
    try {
      res.status(200).send({
        error: false,
        response: note,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  deleteNote: async (req, res) => {
    const userId=req.user

    const data = await Notes.deleteOne({ userId: userId });
    
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

  getNotes: async (req, res) => {
    const userId = req.user;
    try {
      const user = await Users.findOne({ _id: userId });
      const contacts = user.contacts.map((contact) => contact?._id);
      const contactNotes = await Notes.find({ userId: { $in: contacts } }).populate("userId");
      const myNote = await Notes.find({ userId: userId }); 

      res.status(200).send({ result: [...contactNotes, ...myNote ]});
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },


};
