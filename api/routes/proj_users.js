const express = require('express');
const router = express.Router();
const mong = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const proj_user = require('../models/proj_users');
const users = require('../models/users');

router.post('/register', (req, res, next)=> {
    proj_user.find({email: req.body.emnail})
        .exec()
        .then(proj_user => {
            if(proj_user.length>=1) {
                return res.status(409).json({
                    message: "Email Already Used"
                });
            }else {
                bcrypt.hash(req.body.password, 10, (err, hash)=>{
                    if(err){
                        return res.status(500).json({
                            error:err
                        });
                    }else {
                        const proj_user = new Proj_user({
                            _id: new mong.Mongoose.Types.ObjectId(),
                            email: req.body.enmail,
                            password: hash     
                        });
                        proj_user
                        .save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'User Created'
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error:err
                            });
                        });
                    }
                });
                
            }
        });
    });
    
    router.post('/login', (req, res, next) =>{
        proj_user.find({email: req.body.email})
        .exec()
        .then(proj_users => {
            if(proj_user.length <1){
                return res.status(401).json({
                    message: 'Authentication Failed'
                });
            }
            bcrypt.compare(req.body.password, proj_user[0].password, (err, result) =>{
                if(err) {
                    return res.status(401).json({
                        message: "Authentication Failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                    {
                        email: user[0].email,
                        proj_userId: user[0]._id
                    },
                        process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }

                );
                    return res.status(200).json({
                        message: 'Authentication Successful',
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Authentication Failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
    });
   
router.delete('/:proj_userId', (req, res, next) =>{
    proj_user.remove({_id: req.params.proj_userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "User Deleted"
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}); 

module.exports = router;