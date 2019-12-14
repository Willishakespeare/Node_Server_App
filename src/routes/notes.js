const express = require('express')
const router = express.Router()

const Note = require('../models/Note');

router.get('/notes/add', (req, res) => {
    res.render('notes/add')
})

router.post('/notes/addNote', async (req, res) => {
    const {
        title,
        description
    } = req.body
    const errors = []
    if (!title) {
        errors.push({
            text: 'Please Write a Title'
        })
    }
    if (!description) {
        errors.push({
            text: 'Please Write a Description'
        })
    }
    if (errors.length > 0) {
        res.render('notes/add', {
            errors,
            title,
            description
        })
    } else {
        const addNote = new Note({
            title,
            description,
        })
        await addNote.save()
        req.flash('success_msg', 'Nota Agregada')
        res.redirect('/notes')
    }
})

router.get('/notes', async (req, res) => {

    res.render('notes/all')
})

router.get('/notes/edit/:id', async (req, res) => {
    const note = await Note.findById(req.params.id)
    res.render('notes/edit', {
        note
    })
})

router.put('/notes/editNote/:id', async (req, res) => {
    const {
        title,
        description
    } = req.body

    await Note.findByIdAndUpdate(req.params.id, {
        title,
        description
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