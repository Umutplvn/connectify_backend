"use strict";

/*--------------------------------------*
Connectify
/*--------------------------------------*/

const router = require("express").Router();
const User = require("../controller/users");

router.route("/users").get(User.list);
router.route("/users/filter").get(User.filterUser);
router.route("/register").post(User.create);
router.route("/changepassword").put(User.updatePassword);
router.route("/users").put(User.update);
router.route("/users/getmycontacts").get(User.getMyContacts);
router.route("/users/addcontact").post(User.addcontact);
router.route("/users/removecontact").post(User.removecontact);

router
  .route("/users/:userId")
  .get(User.read)
  .put(User.update)
  .delete(User.delete);

module.exports = router;
