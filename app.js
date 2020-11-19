const express = require('express');
const app = express();
const morg = require('morgan');
const bParse = require('body-parser');
const mong = require('mongoose');


const proj_userRoutes = require('./api/routes/proj_users');
const userRoutes = require('./api/routes/users');

mong.connect('mongodb+srv://Shocky:'+ process.env.MONGO_ATLAS_PASSW + '@cluster0.5nue3.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }
);

   


app.use(morg('dev'));
app.use(bParse.urlencoded({extended: false}));
app.use(bParse.json());

app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
});


app.use('/users', userRoutes);


app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

module.exports = app;