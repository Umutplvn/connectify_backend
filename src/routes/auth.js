"use strict"

/*--------------------------------------*
Connectify
/*--------------------------------------*/
const router = require('express').Router()
const Auth = require('../controller/auth')

// Login/logout:

router.post('/login', Auth.login)
router.get('/logout', Auth.logout)
router.post('/logout', Auth.logout)

module.exports=router