"use strict";

/*--------------------------------------*
Connectify
/*--------------------------------------*/

require("express-async-errors");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const User = require("../models/users");
const Token = require("../models/token");
const sendVerificationEmail=require('./emailVerification')

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
    let passcode= Math.floor(Math.random() * 10000) + 2000;
    const data = await User.create(req.body);
    const { email, password, name } = req.body;
    const upName= name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

    if (email && password) {
      const user = await User.findOne({
        email: email,
        password: password,
      });
      if (user) {
        const tokenData =
        "Token " + passwordEncrypt(user._id + `${new Date()}`);
        await Token.create({ userId: user._id, token: tokenData });
        sendVerificationEmail(email, passcode, upName)
        
        res.send({
          error: false,
          result: user,
          Token: tokenData, 
          passcode
        });
      }
    }
  },

  read: async (req, res) => {
    const data = await User.findOne({ _id: req.params.userId });

    res.status(200).send({
      error: false,
      result: data,
    });
  },

  update: async (req, res) => {
    const data = await User.updateOne({ _id: req.params.userId }, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      body: req.body,
      result: await User.findOne({ _id: req.params.userId }),
    });
  },


  delete: async (req, res) => {
    const data = await User.deleteOne({ _id: req.params.userId });
    await Token.deleteOne({userId:req.params.userId})
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


  updatePassword:async(req, res)=>{

    const password=req.body.password
    
    await User.updateOne({_id:req.user}, {password:password}, {
      runValidators: true,
    })
    const newData= await User.findOne({_id:req.user})

    res.status(202).send({
      error:false,
      message:"Password has changed successfully.",
      result:newData
    })
  }
};
