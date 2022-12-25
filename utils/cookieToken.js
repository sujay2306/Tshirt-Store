const cookieToken = (user, res) => {       //need user and sucess response

    const token =  user.getJwtToken();

    const options = {
     expires: new Date(Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 100),
     httpOnly: true
    }
 
 //    #not only for web cookiee but also for mobile
  res.status(200).cookie("token", token,options).json({
    success: true,
    token,
    user,
 
    });
};



module.exports = cookieToken;