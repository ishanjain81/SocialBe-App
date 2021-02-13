//(set without ejs)
// module.exports.home = function(req, res){
//     return res.end('<h1>Express is up for Codeial!</h1>');
// }


//(use view engine)

const Post = require('../models/post');

module.exports.home = function(req,res){

    // Post.find({},function(err,posts){
    //     return res.render('home',{
    //         title: "Codeial | Home",
    //         posts: posts
    //     });
    // })

    //popultate the user of each post
    Post.find({}).populate('user').exec(function(err,posts){
        return res.render('home',{
            title: "Codeial | Home",
            posts: posts
        });
    });

}

// module.exports.actionName = function(req, res){}