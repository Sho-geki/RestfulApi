const mong = require('mongoose');

const user_sc = mong.Schema({
    _id: mong.Schema.Types.ObjectId,
    name: {type: String, required:true},
    number: {type: Number, required:true},
    userImg:{type: String}
});


module.exports=mong.model('User', user_sc);