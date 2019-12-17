const express = require('express')
const router = express.Router()


const User = require('../models/Users')

const passport = require('passport')
const {
    isAuthenticated
} = require('../helpers/auth')

router.get('/users/signin', (req, res) => {
    res.render('users/signin')
})

router.post('/users/signin', passport.authenticate('local', {

    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}))


router.get('/users/signup', isAuthenticated, (req, res) => {

    res.render('users/signup')
})

router.post('/users/signup', async (req, res) => {
    const {
        name,
        iduser,
        password,
        confirm_password
    } = req.body
    const errors = []
    if (name.length <= 0 || iduser.length <= 0 || password.length <= 0 || confirm_password.length <= 0) {
        errors.push({
            text: 'Please Insert All'
        })
    }
    if (password != confirm_password) {
        errors.push({
            text: 'Password do not match'
        })
    }
    if (password.length < 4) {
        errors.push({
            text: 'Password Must be at least 4 characteres'
        })
    }
    if (iduser.length != 16) {
        errors.push({
            text: 'Id Must be at 16 characteres'
        })
    }

    if (errors.length > 0) {
        res.render('users/signup', {
            errors,
            name,
            iduser,
            password,
            confirm_password
        })
    } else {
        const emailUser = await User.findOne({
            iduser: iduser
        })
        if (emailUser) {
            req.flash('error_msg', 'The Id is already in Use')
            res.redirect('/users/signup')
        } else {
            const newUser = new User({
                name,
                iduser,
                password
            })
            newUser.password = await newUser.encryptPassword(password)
            await newUser.save()
            req.flash('success_msg', 'You are Registeres')
            res.redirect('/users/signin')
        }

    }
})

router.get('/users/logout', (req, res) => {
    req.logout()
    res.redirect('/users/signin')
})

module.exports = router