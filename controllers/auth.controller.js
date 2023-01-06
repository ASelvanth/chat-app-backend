const express = require('express');
const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//registration - signup
const register = async (req, res) =>{
    // res.send('Welcome to register');
    try{
        const payload = req.body;

        //if no password provided
        if(!payload.password){
            return res.status(400).send({
                message : " Password is required"
            })
        }

        //if password provided, then create hash password
        const hashValue = await bcrypt.hash(payload.password , 10)
        //once password is generated then give password to hash
        payload.hashedPassword = hashValue;
        //once hash password is generated then remove password from payload
        delete payload.password;

        //passes data to Users model
        let newUser = new Users(payload); //validating the payload

        //insert new user into db- save() done.
        newUser.save((err, data) =>{
            if(err){
                return res.status(400).send({
                    message : "Error while registering the user",error: err});
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
           const token = await jwt.sign({ _id : existingUser._id},process.env.SECRET_KEY);
            
            res.cookie('accessToken', token,{ 
                expire : new Date() + 8400000
                // sameSite : 'strict',
                // path : '/',
                // httpOnly : true,
            });

            return res.status(201).send({
                message : 'User has been signed in',
                // userID: existingUser._id;
            });
          }
         
          return res.status(401).send({ message : "Invalid credentials"});
        }

        res.status(400).send({message : 'user does not exist'});

    }catch(error){

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

module.exports = {register,signin,signout}