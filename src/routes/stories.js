"use strict";

/*--------------------------------------*
Connectify
/*--------------------------------------*/

const router = require("express").Router();
const Stories = require("../controller/stories");

router.route("/createstory").post(Stories.createStory);
router.route("/deletestory").delete(Stories.deleteStory);
router.route("/getstories").get(Stories.getStories);


module.exports = router;
