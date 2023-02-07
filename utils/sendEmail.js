const nodemailer = require('nodemailer');

exports.sendEmail = async ( email, subject , payload)=>{
    try{
        var transporter = await nodemailer.createTransport({
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
            text : JSON.stringify(payload)
            //users details (users name & link)
        };

        await transporter.sendMail(mailOptions , (err, data)=>{
            if(err){
                console.log('Error While sending mail' , err);
                return false;
            }
            console.log('Success..')
            return  true;
        })

    }catch(error){
        console.log('Error  : send mail :' , err);
        return false;
    }
}

