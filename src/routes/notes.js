"use strict";

/*--------------------------------------*
Connectify
/*--------------------------------------*/

const router = require("express").Router();
const Notes = require("../controller/notes");

router.route("/createnote").post(Notes.createNote);
router.route("/deletenote").delete(Notes.deleteNote);
router.route("/getnotes").get(Notes.getNotes);


module.exports = router;
