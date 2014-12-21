var Profile = {};
var nodebb = require('../../nodebb'),
	db = nodebb.db,
  User = nodebb.User,
  winston = nodebb.winston,
	async = nodebb.async;
var config = require('../../plugin.json');

Profile.get = function (callback) {
	Profile.getFields(0,-1,function(err,sets){
		if(err)return callback(null,[]);
		Profile.getPropFields(sets,callback);
	});
};

Profile.add = function(data,callback){
	Profile.exists(data.fieldName, function (err, exists) {
		if ( err ) {
			return callback(err);
		}
		if (exists) {
			return callback(new Error('The field [' + data.fieldName + '] already exists'));
		}
		if(data.opts){
			data.opts = JSON.stringify(data.opts)
		}
		db.sortedSetAdd(config.id + ':profiles', Date.now(), data.fieldName,function(err){
			db.setObject(config.id + ':profile:' + data.fieldName, data, function(err){
				if(err){
					db.sortedSetRemove(config.id + ':profiles', data.fieldName,function(){
						return callback(err);
					});
				}else{
					callback();
				}
			});
		});
	});
};

Profile.remove = function(name,callback){
	Profile.exists(name, function (err, exists) {
		if ( err ) {
			return callback(err);
		}
		if (!exists) {
			return callback(new Error('The field [' + name + '] not found'));
		}
		db.sortedSetRemove(config.id + ':profiles', name,function(){
			db.delete(config.id + ':profile:' + name, callback);
		});
	});
};

Profile.exists = function(name,callback){
	db.isSortedSetMember(config.id + ':profiles', name, callback);
};

Profile.getPropFields = function (sets, callback) {
	var keys = sets.map(function (name) {
		return config.id + ':profile:' + name.value;
	});
	db.getObjects(keys, function (err, data) {
		if (err) {
			return callback(err);
		}
		data.forEach(function(set,idx){
			if(set.opts == '[object Object]'){
				set.opts = '';
			}
		});
		callback(null, data);
	});
};
Profile.getFields = function (start, end, callback) {
	db.getSortedSetRangeWithScores(config.id + ':profiles', start, end, callback);
};


Profile.saveExtends = function(uid,data,callback){
	User.setUserFields(uid,data.data,callback);
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
