var crypto = require('crypto');
var jade = require('jade');
var fs = require('fs');
var tagModel = require('./models/tag');
var adminModel = require('./models/admin');

exports.siteRelevant = function(req, res, next){
    var tagList = tagModel.readTagList();
    var config = adminModel.readSetting();
    var relevant = jade.renderFile('views/relevant.jade', {
        loginStatus: req.session.loginStatus, 
        tagList: tagList, 
        webinfo: config.webinfo, 
        links: config.links
    });
    req.app.locals.relevant = relevant;
    next();
};

exports.currentNav = function(req, res, next){
    var nav = 'index';
    if (req.path == '/user/login'){
        nav = 'login';
    }else if(req.path == '/about' || req.path == '/about.html'){
        nav = 'about';
    }else if(/\/*\/(add|update|delete|setting|passwd)(\/*)?/.test(req.path)){
        nav = 'admin';
    }
    req.app.locals.currentNav = nav;
    next();
};

exports.mkrandomName = function(){
    var seeds = '0123456789abcdefghijklmnopqrstuvwxyz';
    var name = '';
    var length = seeds.length;
    for(var i=0; i<16; i++){
        name += seeds.substr(Math.round(Math.random()*length), 1);
    }

    return name;
};

exports.uploadFile = function(files, name){
    var uploadDir = 'public/upload/';
    var date = new Date();
    var subFolderYear = date.getFullYear();
    uploadDir = uploadDir + subFolderYear + '/';
    if (!fs.existsSync(uploadDir)){
		fs.mkdirSync(uploadDir, 0755);
    }

    var subFolderMonth = ('0'+(date.getMonth()+1)).substr(-2);
    uploadDir = uploadDir + subFolderMonth + '/';
    if (!fs.existsSync(uploadDir)){
		fs.mkdirSync(uploadDir, 0755);
    }

    var tempPath = files[name].path;
    var filePath = uploadDir + this.mkrandomName() + tempPath.substr(-4);
    fs.renameSync(tempPath, filePath);
    return filePath.replace('public', '');
};
