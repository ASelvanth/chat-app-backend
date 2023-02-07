const express = require('express');
const Users = require('../models/users.model');
const Tokens = require('../models/tokens.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const {sendEmail } = require('../utils/sendEmail');


//registration - signup
const register = async (req, res) =>{
    // res.send('Welcome to register');
    try{
        const payload = req.body;
        //if no password provided
        if(!payload.password){
            return res.status(400).send({message : " Password is required"})
        }

        //if password provided, then create hash password
        const hashValue = await bcrypt.hash(payload.password , 10);
        //once password is generated then give password to hash
        payload.hashedPassword = hashValue;
        //once hash password is generated then remove password from payload
        delete payload.password;

        //passes data to Users model
        let newUser = new Users(payload); //validating the payload

        //insert new user into db- save() done.
        newUser.save((err, data) =>{
            if(err){
                return res.status(400).send({message : "Error while registering the user",error: err});
            }           
            res.status(201).send({message : 'User have been registered', userID: data._id});
        });
    }catch(error){
        res.status(500).send({message : "Internal Server Error"});
                
    }
}

//Login user
const signin = async (req, res) =>{
    // res.send('Welcome to signin');
    try{
        const {email , password} = req.body;
        const existingUser = await Users.findOne({email: email});

        if(existingUser){
          const isValidUser =  await bcrypt.compare(password, existingUser.hashedPassword);
          
          if(isValidUser){
            //Encryption
           const token = await jwt.sign({ _id : existingUser._id},process.env.SECRET_KEY);
            
            res.cookie('accessToken', token,{ 
                expire : new Date() + 86400000
                // sameSite : 'strict',
                // path : '/',
                // httpOnly : true,
            });

            return res.status(201).send({message : 'User has been signed in',
                // userID: existingUser._id;
            });
          }
         
          return res.status(401).send({ message : "Invalid credentials"});
        }

        res.status(400).send({message : 'user does not exist'});

    }catch(error){
        console.log('Error : ', error)
        res.status(500).send({ message : 'Internal Server Error',error : error });
    }  

}

//log out user
const signout = async (req, res) =>{
    // res.send('user signout');

    try{
        await res.clearCookie('accessToken');
        res.status(200).send({message : 'User has been signed out'});

    }catch(error){
        res.status(500).send({ message : 'Internal Server Error',error : error });

    }
}

//Forgot password
const forgetPassword = async (req, res) =>{
    try{
        const {email} = req.body;
        //email not provided
        if(!email){
            return res.status(400).send({message :'Email is mandatory'});
        }
        const user = await Users.findOne({email: email});

        //if user does not exist
        if(!user){
            return res.status(400).send({message :" User does not exist"});
        }

        let token = await Tokens.findOne({userId : user._id});
        //if token already have token previously -- old token will be delete here
        if(token){
            await token.deleteOne();
        }
        //new token will be created
        let newToken = crypto.randomBytes(32).toString('hex'); 

        // new token --> hashed token - for secured
        const hashedToken = await bcrypt.hash(newToken , 10);

        //validating the payload - all fields are valid
        const tokenPayload = new Tokens({userId : user._id , token : hashedToken , createdAd :Date.now()});

        await tokenPayload.save();

        const link = `http://localhost:3000/passwordReset?token=${newToken}&id=${user._id}`;

        await sendEmail(user.email, 'Password Reset Link', {name: user.name, link: link});

        res.status(200).send({message : 'Email sent successfully'});

    }catch(error){
        console.log('Error: ', error)
        res.status(500).send({message: "Internal Server Error"});
    }
}

//Reset password
const resetPassword = async (req, res) =>{
    const {userId, token , password }= req.body;

    let resetToken = await Tokens.findOne({userId : userId});

    if(!resetToken){
        return res.status(401).send({message : 'Invalid or expired token'});
    }
    //comparing the tokens  - validate
    const isValid = await bcrypt.compare(token , resetToken.token);

    if(!isValid){
        return res.status(400).send({message : 'Invalid token'});
    }
    
    const hashedPassword = await bcrypt.hash(password , 10);

    Users.findByIdAndUpdate({_id : userId},{$set : {hashedPassword : hashedPassword}} ,(err, data) =>{
        if(err){
            return res.status(400).send({message : 'Error while resetting password'});
        }        
    });

    await resetToken.deleteOne();

    return res.status(200).send({message : 'Password has been reset successfully'});
}

module.exports = {register,signin,signout,forgetPassword ,resetPassword}