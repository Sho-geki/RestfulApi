const jwt = require('jsonwebtoken');

module.export = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verif(token, process.env.JWT_KEY);
        req.proj_userData = decode;
        next();
    }catch(error){
        return res.status(401).json({
            message: 'Authentication Failed'
        });
    }
    
    next();
}