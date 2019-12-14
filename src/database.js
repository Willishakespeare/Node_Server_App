const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Willishakespeare:skr13@cluster0-b0qwy.azure.mongodb.net/test?retryWrites=true&w=majority', {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })

    .then(db => console.log('db is connected'))
    .catch(err => console.log(err))