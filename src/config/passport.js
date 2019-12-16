const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Users = require('../models/Users');

passport.use(new LocalStrategy({
    usernameField: "iduser"
}, async (iduser, password, done) => {

    const user = await Users.findOne({
        iduser: iduser
    })
    console.log(user)
    if (!user) {
        return done(null, false, {
            message: 'Not User Found'
        })
    } else {
        const match = await user.matchPassword(password)
        if (match) {
            return done(null, user)
        } else {
            return done(null, false, {
                message: 'Incorrect Password'
            })
        }
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    Users.findById(id, (err, user) => {
        done(err, user)
    })
})