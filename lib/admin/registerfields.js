var Fields = {};
var nodebb = require('../../nodebb'),
db = nodebb.db,
async = nodebb.async;
var config = require('../../plugin.json');

Fields.get = function (callback) {
 Fields.getFields(0,-1,function(err,sets){
  if(err)return callback(null,[]);
  Fields.getPropFields(sets,callback);
 });
}

Fields.add = function(data,callback){
 Fields.exists(data.fieldName, function (err, exists) {
  if ( err ) {
   return callback(err);
  }
  if (exists) {
   return callback(new Error('The field [' + data.fieldName + '] already exists'));
  }
  if(data.opts){
   data.opts = JSON.stringify(data.opts)
  }
  db.sortedSetAdd(config.id + ':registers', Date.now(), data.fieldName,function(err){
   db.setObject(config.id + ':register:' + data.fieldName, data, function(err){
    if(err){
     db.sortedSetRemove(config.id + ':registers', data.fieldName,function(){
      return callback(err);
     });
    }else{
     callback();
    }
   });
  });
 });
}

Fields.remove = function(name,callback){
 Fields.exists(name, function (err, exists) {
  if ( err ) {
   return callback(err);
  }
  if (!exists) {
   return callback(new Error('The field [' + name + '] not found'));
  }
  db.sortedSetRemove(config.id + ':registers', name,function(){
   db.delete(config.id + ':register:' + name, callback);
  });
 });
}

Fields.exists = function(name,callback){
 db.isSortedSetMember(config.id + ':registers', name, callback);
}

Fields.getPropFields = function (sets, callback) {
 var keys = sets.map(function (name) {
  return config.id + ':register:' + name.value;
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
Fields.getFields = function (start, end, callback) {
 db.getSortedSetRangeWithScores(config.id + ':registers', start, end, callback);
};
module.exports = Fields;
