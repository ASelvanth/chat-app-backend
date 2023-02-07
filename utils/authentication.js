// const { expressjwt } = require('express-jwt');
const jwt = require('jsonwebtoken');

exports.isAuth = async (req, res, next) =>{

    const { cookies } = req;

    // console.log('cookies :',cookies);
    // let user = req.auth._id === req.params.userID;
    // let user = req.auth._id ;
    // let user = true ;
    const data = jwt.verify(cookies.accessToken ,process.env.SECRET_KEY);
    // console.log('Decrypted Data:', data._id);
    req.id = data._id;

    if(!req.id){
        return res.status(401).send({message: 'Not authorized'});
    }
    next();
}

// module.exports = {isAuth };
// exports.requireSignin = expressjwt({
//     secret: process.env.SECRET_KEY,
//     algorithms: ['HS256'],
//     //HS256 - encryption & decryption key  both same
//     //RS256 - encryption & decryption key both different
//     userProperty : 'auth'
//     //auth - userId
// });

// _id : 'adsdffd56r'
//userProperty : 'auth' ; // req.auth._id