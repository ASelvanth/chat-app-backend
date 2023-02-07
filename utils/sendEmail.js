const nodemailer = require('nodemailer');

exports.sendEmail = async ( email, subject , userPayload)=>{
    try{
        var transpoter = await nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user: 'ajselva04@gmail.com',
                pass : process.env.EMAIL_PASSWORD 
            }
        });

        var mailOptions = {
            from : 'ajselva04@gmail.com',
            to : email,
            subject : subject,
            text : JSON.stringify(userPayload)
            //users details (users name & link)
        };

        await transpoter.sendMail(mailOptions , (err, data)=>{
            if(err){
                return false;
            }

            return  true;
        })

    }catch(error){
        return false;
    }
}

// module.exports = {sendMail}