const mong = require('mongoose');

const proj_user_Schema = mong.Schema({
    _id: mong.Schema.Types.ObjectId,
    email: {type: String, required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    password: {type: String, required: true}
});


module.exports=mong.model('proj_user', proj_user_Schema);