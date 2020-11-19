const express = require('express');
const router = express.Router();
const mong = require('mongoose');
const mult = require('multer');
const checkAuth = require('../middleware/check_auth');


const storage = mult.diskStorage({
    destination: function(req, file, callback){
        callback(null, './uploads');
    },
    filename: function(req, file, callback){
        callback(null, new Date().toISOString()+file.originalname);
    }
});

const fileFilter = (req, file, callback) =>{
    //reject
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'|| file.mimetype === 'excel/xlsx' || file.mimetype === 'document/docx' || file.mimetype === 'text/txt') {
        callback(null, true);
    } else{
        callback(null, false);
    }

};


const upload = mult({storage: storage,
    limits:{
    fileSize: 1024 *1024 * 20
    },
    fileFilter: fileFilter
});

const User = require('../models/users');

router.get('/', (req, res, next) => {
    User.find()
    .select('name number _id userImg')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            users: docs.map(doc => {
                return{
                    name: doc.name,
                    number: doc.number,
                    userImg: doc.userImg,
                    _id: doc._id,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/users/' + docs._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', checkAuth, upload.single('UserImage'), (req, res, next) => {
    const userDB = new User({
        _id: new mong.Types.ObjectId(),
        name: req.body.name,
        number: req.body.number,
        userImg: req.file.path
    });
    userDB
    .save()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Created User',
            createdUser: {
                name: result.name,
                number: result.number,
                _id : result._id,
                request:{
                    type: 'GET',
                    url: 'http://localhost:3000/users/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
});

router.get('/:userID',checkAuth, (req, res, next) => {
    const id = request.params.userID;
    User.findById(id)
    .select('name number _id userImg')
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc) {
            res.status(200).json({
                user: doc,
                request:{
                    type: 'GET',
                    description: 'Get_All_Users',
                    url: 'http://localhost:3000/users/' + docs._id
                }
            });
                
        }else{
            res.status(404).json({message:"No Valid Entry of ID"});
        }
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:userID',checkAuth, (req, res, next) => {
    const id = req.params.userId;
    const updateUser = {};
    for (const ops of req.body) {
        updateUser[ops.propName] = ops.value;
    }
    User.update({_id: id}, {$set: updateUser})
    .exec()
    .then(result => {
         res.status(200).json({
             message: 'User Updated',
             request:{
                type: 'GET',
                url: 'http://localhost:3000/users/' + id
            }
         });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });

});

router.delete('/:userID', checkAuth, (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id:id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User Deleted',
            request:{
                type: 'POST',
                url: 'http://localhost:3000/users/',
                body: {name: 'String', number: 'Number'}

             }
            }
        );
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});


module.exports = router;