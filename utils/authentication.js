const { expressjwt } = require('express-jwt');

exports.requireSignin = expressjwt({
    secret: process.env.SECRET_KEY,
    algorithms: ['HS256'],
    //HS256 - encryption & decryption key  both same
    //RS256 - encryption & decryption key both different
    userProperty : 'auth'
    //auth - userId
});

// _id : 'adsdffd56r'
//userProperty : 'auth' ; // req.auth._id

exports.isAuth = (req, res, next) =>{

    let user = req.auth._id === req.params.userID;
    // let user = req.auth._id ;

    if(!user){
        return res.status(401).send({message: 'Unauthorized'});
    }
    next();

}

// module.exports = {isAuth };