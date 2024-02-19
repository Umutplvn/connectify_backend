"use strict"

/*--------------------------------------*
Connectify
/*--------------------------------------*/

const router = require('express').Router()
const User = require('../controller/users')


router.route('/users')
    .get(User.list)

router.route('/users/filter')
    .get(User.filterUser)

router.route('/register')
    .post(User.create)

router.route('/changepassword')
    .put(User.updatePassword)

router.route('/users/:userId')
    .get(User.read)
    .put(User.update)
    .delete(User.delete)
    

module.exports = router