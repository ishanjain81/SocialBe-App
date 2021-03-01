const User = require('../models/user');
const RPass = require('../models/reset_pass');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ResetPasswordMailer = require('../mailers/resetPass_mailer');
const SignUpMailer = require('../mailers/signup_mailer');


// module.exports.profile = function(req, res){
//     if(req.cookies.user_id){
//         User.findById(req.cookies.user_id,function(err,user){
//             if(user){
//                 return res.render('user_profile',{
//                     title: "User Profile",
//                     user: user
//                 })
//             }
//             return res.redirect('/users/sign-in');
//         });
//     }
//     else{
//         return res.redirect('/users/sign-in');
//     }
// }


module.exports.profile = function(req, res){
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile',{
            title: "SocialBe | Profile",
            profile_user: user
        });
    });
}


module.exports.update = async function(req,res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
    //         req.flash('success', 'Updated!');
    //         return res.redirect('back');
    //     });
    // }
    // else{
    //     req.flash('error', 'Unauthorized!');
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id){
        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){console.log('*****Multer Error : ',err); return}

                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){

                    if(user.avatar && fs.existsSync(path.join(__dirname,'..',user.avatar))){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }

                    //this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                req.flash('success', 'Updated!');
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    }
    else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }

}


//render sign up page
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title: "SocialBe | Sign Up"
    })
}

//render sign in page
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title: "SocialBe | Sign In"
    })
}


//get the sign up data
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }
    User.findOne({email: req.body.email},function(err, user){
        if(err){req.flash('error', err); return}
        if(!user){
            User.create(req.body,function(err,user){
                if(err){req.flash('error', err); return}
                req.flash('success', 'You have signed up, login to continue!');
                SignUpMailer.newSignUp(req.body.email,req.body.name);
                return res.redirect('/users/sign-in');
            });
        }
        else{
            req.flash('error', 'User Already exits ! Please Sign in');
            return res.redirect('/users/sign-in');
        }
    });
}

//get the sign in data using manual
// module.exports.createSession = function(req,res){
//     //find the user
//     User.findOne({email: req.body.email},function(err, user){
//         if(err){
//             console.log('error in finding user in signing in');
//             return;
//         }
//         //handle user found
//         if(user){
//             //handle password which doesn't match
//             if(user.password != req.body.password){
//                 return res.redirect('back');
//             }
//             //handle session creation
//             res.cookie('user_id',user.id);
//             return res.redirect('/users/profile');
//         }
//         else{
//             //handle user not found
//             return res.redirect('back');
//         }
//     });
    
// }

//get the sign in data using passport
module.exports.createSession = function(req,res){
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}


module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','You have logged out');
    return res.redirect('/');
}

module.exports.EnteringEmail = function(req,res){
    return res.render('reset_pass_email',{
        title: "SocialBe | Reset Password",
    });
}

module.exports.updatePass = function(req,res){
    console.log(req.body.email);
    User.findOne({email: req.body.email},function(err, user){
        if(err){console.log('Error in finding a User'); return}
        if(user){
            let Calling = () => {
                RPass.findOne({user: user._id},function(err,User_Pass){
                    if(err){console.log('Error in finding a User in RPass'); return}
                    ResetPasswordMailer.ResetPass(User_Pass,req.body.email);
                    req.flash('success','Please Check Your Mail To Change Your Password');
                    return res.redirect('/');
                });
            }
            RPass.findOne({user: user._id},function(err,User_Pass){
                if(err){console.log('Error in finding a User in RPass And Deleting'); return}
                if(User_Pass){
                    User_Pass.remove();
                }
            });
            RPass.create({
                user: user._id,
                token: crypto.randomBytes(20).toString('hex'),
                isvalid: true,
            },Calling());
        }
        else{
            req.flash('error', 'User doesnt exist');
            res.redirect('back');
        }
    });
}

module.exports.PassingResetForm = function(req,res){
    const Token = req.query.to;
    // console.log('Inside Form To Reset Password ',Token);
    RPass.findOne({token: Token},function(err,user){
        if(err){console.log('Error in finding a User Using Token'); return}
        if(!user){
            req.flash('error', 'Invalid Url');
            return res.redirect('/users/sign-in');
        }
        else{
            return res.render('reset_Pass_Form',{
                title: "SocialBe | Reset Password",
                user: user
            });
        }
    });
}

module.exports.updatePassword = function(req,res){
    if(req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }
    RPass.findById(req.params.id,function(err,user){
        if(err){console.log('Error in finding a User Using Token in Password Updating'); return}
        if(!user.isvalid){
            req.flash('error', 'Link has Expired!');
            return res.redirect('/users/sign-in');
        }
        else{
            user.isvalid = false;
            User.findById(user.user,function(err,person){
                if(err){console.log('Error in finding a Person Using Token in Password Updating'); return}
                person.password = req.body.password;
                user.save();
                person.save();
                req.flash('success','Password Changed Successfully');
                return res.redirect('/users/sign-in');
            });
        }
    });
}   