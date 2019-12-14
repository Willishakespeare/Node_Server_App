const express = require("express")
const path = require('path')
const exhbs = require('express-handlebars')
const method0verride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

const MomentHandler = require("handlebars.moment");

//initializations
const app = express()
require('./database')
//setings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exhbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: {
        FormatDate: function formatDate(date) {
            var monthNames = [
                "ENE", "FEB", "MAR",
                "ABR", "MAY", "JUN", "JUL",
                "AGO", "SEP", "OCT",
                "NOV", "DIC"
            ];

            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();
            var hour = date.getHours() + "";
            var minutes = date.getMinutes() + "";
            var seconds = date.getSeconds() + "";

            hour = checkZero(hour);
            mintues = checkZero(minutes);
            seconds = checkZero(seconds);
            var time = checkHour(hour, minutes, seconds);

            return day + '/' + monthNames[monthIndex] + '/' + year + ' ' + time;

            function checkZero(data) {
                if (data.length == 1) {
                    data = "0" + data;
                }
                return data;
            }

            function checkHour(data, data2, data3) {
                if (parseInt(data, 10) > 12) {
                    data = parseInt(data, 10) - 12;
                    data = data + ':' + data2 + ':' + data3 + " PM"
                } else {
                    data = data + ':' + data2 + ':' + data3 + " AM"
                }
                return data;
            }

        }
    }

}))
app.set('view engine', 'hbs')
//middleweres
app.use(express.urlencoded({}))
app.use(method0verride('_method'))
app.use(session({
    secret: 'secApp',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())
//global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})
//routes
app.use(require('./routes/index'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))
//static files 
app.use(express.static(path.join(__dirname, 'public')))
// server 
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
})