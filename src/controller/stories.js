"use strict";

/*--------------------------------------*
Connectify
/*--------------------------------------*/

require("express-async-errors");
const Stories = require("../models/stories");
const Users = require("../models/users");
const multer = require('multer');

module.exports = {
  
  createStory: async (req, res) => {
    const userId = req.user;
    const { content } = req.body;

    try {
      
        const storage = multer.memoryStorage();
        const upload = multer({ storage: storage }).single('image');

        upload(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(400).send('Error uploading file');
            }

            const image = req.file;

            const story = await Stories.create({ userId, content, image });

            res.status(200).send({
                error: false,
                response: story,
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
},

  deleteStory: async (req, res) => {
    const userId=req.user

    const data = await Stories.deleteOne({ userId: userId });
   
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

  getStories: async (req, res) => {
    const userId = req.user;
    try {
      const user = await Users.findOne({ _id: userId });
      const contacts = user.contacts.map((contact) => contact?._id);
      const contactStories = await Stories.find({ userId: { $in: contacts } });

      res.status(200).send({ result: contactStories });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },


};
