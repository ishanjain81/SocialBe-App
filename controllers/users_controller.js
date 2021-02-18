const User = require('../models/user');
const fs = require('fs');
const path = require('path');

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
            title: "Profile",
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
        title: "Codeial | Sign Up"
    })
}

//render sign in page
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title: "Codeial | Sign In"
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
                return res.redirect('/users/sign-in');
            })
        }
        else{
            req.flash('success', 'You have signed up, login to continue!');
            res.redirect('back');
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