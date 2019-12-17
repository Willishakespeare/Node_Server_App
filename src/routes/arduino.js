const express = require('express')
const router = express.Router()

const Note = require('../models/Note');
const Users = require('../models/Users');
const Register = require('../models/Register');

router.get('/arduino', async (req, res) => {
    var user_id = req.query.id;
    var token = req.query.token;
    var query = {
        iduser: token
    }
    const users = await Users.find(query)
    if (isEmpty(users)) {
        res.send("code0001");
    } else {
        res.send("code0002");

        var addquery = {
            name: users[0].name,
            id: users[0].iduser
        }
        const addNote = new Register(addquery)
        await addNote.save()

    }

    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
})


module.exports = router