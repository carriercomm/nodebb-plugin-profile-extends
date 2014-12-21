var Profile = {};
var nodebb = require('../../nodebb'),
	db = nodebb.db,
  User = nodebb.User,
  winston = nodebb.winston,
	async = nodebb.async;
var config = require('../../plugin.json');

Profile.get = function (callback) {
	var list = [];
	callback(null, list);
};

Profile.saveExtends = function(uid,data,callback){

	callback();
};

Profile.saveRegister = function(uid,data,callback){
		User.setUserFields(uid,data.data,callback);
};

Profile.getSettings = function(uid,callback){
	db.getObject(config.id+':settings:'+uid,callback);
};
Profile.saveSettings = function(uid,data,callback){
	if(data){
		db.setObject(config.id+':settings:'+uid,data,callback);
	}else{
		Profile.removeSettings(uid,callback);
	}
};
Profile.removeSettings = function(uid,callback){
	callback = callback || function(){};
	db.delete(config.id+':settings:'+uid,callback);
};
module.exports = Profile;
