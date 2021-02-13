//(set without ejs)
// module.exports.home = function(req, res){
//     return res.end('<h1>Express is up for Codeial!</h1>');
// }


//(use view engine)
module.exports.home = function(req,res){
    return res.render('home',{
        title: "Ishan"
    });
}

// module.exports.actionName = function(req, res){}