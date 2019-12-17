const express = require('express')
const router = express.Router()

const Note = require('../models/Register');
const {
    isAuthenticated
} = require('../helpers/auth')

// router.get('/notes/add', isAuthenticated, (req, res) => {
//     res.render('notes/add')
// })

// router.post('/notes/addNote', async (req, res) => {
//     const {
//         name,
//         description,
//         id
//     } = req.body
//     const errors = []
//     if (!name) {
//         errors.push({
//             text: 'Please Write a name'
//         })
//     }
//     if (!description) {
//         errors.push({
//             text: 'Please Write a Description'
//         })
//     }
//     if (errors.length > 0) {
//         res.render('notes/add', {
//             errors,
//             name,
//             description
//         })
//     } else {
//         const addNote = new Note({
//             name,
//             description,
//         })
//         await addNote.save()
//         req.flash('success_msg', 'Nota Agregada')
//         res.redirect('/notes')
//     }
// })

router.get('/notes', isAuthenticated, async (req, res) => {
    const note = await Note.find({
        id: req.user.iduser
    }).sort({
        date: 'desc'
    })
    res.render('notes', {
        note
    })
})

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id)
    res.render('notes/edit', {
        note
    })
})

router.put('/notes/editNote/:id', async (req, res) => {
    const {
        name,
        id
    } = req.body

    await Note.findByIdAndUpdate(req.params.id, {
        name,
        id
    })
    req.flash('success_msg', 'Nota Actualizada')
    res.redirect('/notes')
})

router.delete('/notes/delete/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg', 'Nota Borrada')
    res.redirect('/notes')
})



module.exports = router