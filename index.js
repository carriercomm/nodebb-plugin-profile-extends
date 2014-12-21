var nodebb = require('./nodebb'),
	SocketAdmin = nodebb.SocketAdmin,
	SocketPlugins = nodebb.SocketPlugins,
	User = nodebb.User,
	meta = nodebb.meta,
	templates = nodebb.templates,
	async = nodebb.async;
var fs = require('fs');
var config = require('./plugin.json');
var admin = require('./lib/admin');
var socketAdminHander = {};
var socketHander = {};
(function (profile) {

	socketAdminHander.register = {};
	socketAdminHander.profile = {};

	socketAdminHander.register.get = function (socket, data, callback) {
		admin.register.get(callback);
	};
	socketAdminHander.register.add = function (socket, data, callback) {
		if (!data) return callback(new Error('data was null.'));
		admin.register.add(data, callback);
	};
	socketAdminHander.register.remove = function (socket, data, callback) {
		if (!data) return callback(new Error('data was null.'));
		admin.register.remove(data, callback);
	};

	socketAdminHander.profile.get = function (socket, data, callback) {
		admin.profile.get(callback);
	};
	socketAdminHander.profile.add = function (socket, data, callback) {
		if (!data) return callback(new Error('data was null.'));
		admin.profile.add(data, callback);
	};
	socketAdminHander.profile.remove = function (socket, data, callback) {
		if (!data) return callback(new Error('data was null.'));
		admin.profile.remove(data, callback);
	};

	socketHander.register = {};
	socketHander.profile = {};

	socketHander.register.save = function(socket,data,callback){
		if (!socket.uid) {
			return callback('[[error:invalid-uid]]');
		}

		if (!data || !data.uid) {
			return callback(new Error('[[error:invalid-data]]'));
		}

		if (socket.uid === parseInt(data.uid, 10)) {
			return admin.profile.saveRegister(socket.uid, data, callback);
		}

		User.isAdministrator(socket.uid, function(err, isAdmin) {
			if (err) {
				return callback(err);
			}

			if (!isAdmin) {
				return callback(new Error('[[error:no-privileges]]'));
			}

			admin.profile.saveRegister(data.uid,data,callback);
		});
	};
	socketHander.profile.save = function(socket,data,callback){
		if (!socket.uid) {
			return callback('[[error:invalid-uid]]');
		}

		if (!data || !data.uid) {
			return callback(new Error('[[error:invalid-data]]'));
		}

		if (socket.uid === parseInt(data.uid, 10)) {
			return admin.profile.saveExtends(socket.uid, data, callback);
		}

		User.isAdministrator(socket.uid, function(err, isAdmin) {
			if (err) {
				return callback(err);
			}

			if (!isAdmin) {
				return callback(new Error('[[error:no-privileges]]'));
			}

			admin.profile.saveExtends(data.uid,data,callback);
		});
	};
	socketHander.fields =function(socket, data, callback){
		async.parallel({
			register: async.apply(admin.register.get),
			profile: async.apply(admin.profile.get)
		},function(err,results){
			callback(err,results);
		});
	}

	function renderAdmin(req, res, next) {
		async.parallel({
			register: async.apply(admin.register.get),
			profile: async.apply(admin.profile.get)
		}, function (err, result) {
			if (err) {
				return next(err);
			}
			result.supportTypes = require('./form_type_support.json');
			res.render('admin/plugins/profileext', result);
		});
	}

	function renderExtendsProfile(req, res, next) {
		var callerUID = req.user ? parseInt(req.user.uid, 10) : 0;
		var userData;
		async.waterfall([
			function (next) {
				nodebb.getUserDataByUserSlug(req.params.userslug, callerUID, next);
			},
			function (data, next) {
				userData = data;
				if (!userData) {
					return nodebb.helpers.notFound(req, res);
				}
				userData.infocomplete = 0;
				userData.infototal = 0;
				var registerfields = [];
				admin.register.get(function (err, results) {
					userData.infototal += results.length;
					for (var i = 0; i < results.length; i++) {
						var formSet = 'register-' + results[i].fieldName;
						var set = {};
						set.type = results[i].fieldName;
						set.name = formSet;
						set.value = userData[formSet] || null;
						registerfields.push(set);
						if(userData[formSet]){
							userData.infocomplete ++;
						}
					}
					userData.registerfields = registerfields;
					next(null,userData);
				});
			},
			function(data,next){
				var profilefields = [];
				admin.profile.get(function (err, results) {
					userData.infototal += results.length;
					for (var i = 0; i < results.length; i++) {
						var formSet = 'profile-' + results[i].fieldName;
						var set = {};
						set.type = results[i].fieldName;
						set.name = formSet;
						set.value = userData[formSet] || null;
						profilefields.push(set);
						if(userData[formSet]){
							userData.infocomplete ++;
						}
					}
					userData.profilefields = profilefields;
					next(null,userData);
				});
			}
		], function (err, data) {
			if (err) {
				return next(err);
			}
			console.log(userData)
			if(parseInt(meta.config.requireEmailConfirmation,10) === 1){
				userData.infototal ++;
				if(userData['email:confirmed']){
					userData.infocomplete ++;
				}
			}
			res.render('account/profileext', userData);
		});

	}

	profile.templateMapping = function (config, callback) {
		config.custom_mapping['^user/.*/extends'] = 'account/profileext';
		//there is fucking hacking that foreach index
		delete config.custom_mapping['^user/.*'];
		config.custom_mapping['^user/.*'] = 'account/profile';
		callback(null,config);
	};
	profile.init = function (args, callback) {
		var router = args.router,
			middleware = args.middleware,
			controllers = args.controllers;

		router.get('/api/admin/plugins/profileext', renderAdmin);
		router.get('/admin/plugins/profileext', middleware.admin.buildHeader, renderAdmin);

		router.get('/api/user/:userslug/extends', [middleware.pageView, middleware.checkGlobalPrivacySettings, middleware.checkAccountPermissions], renderExtendsProfile);
		router.get('/user/:userslug/extends', middleware.buildHeader, [middleware.pageView, middleware.checkGlobalPrivacySettings, middleware.checkAccountPermissions], renderExtendsProfile);

		SocketAdmin[config.id] = socketAdminHander;
		SocketPlugins[config.id] = socketHander;
		callback();
	};

	profile.postsProfileFields = function (data, callback) {
		// data.uid;
		// data.profile.push({content:'hello'});
		callback(null, data);
	};


	profile.userSettings = function(settings,callback){
		fs.readFile('./public/templates/account/prosettings.tpl', function(err, data) {
			templates.parse(data ? data.toString('utf8') : '',{prefix:'',settings:require('./profile_settings.json')},function(content){
				settings.push({title:'[[profileext:settings.title]]',content:content});
				callback(null,settings);
			});
		});
	};
	profile.userGetSettings = function(data,callback){
		admin.profile.getSettings(data.uid,function(err,settings){
			var settingsets = require('./profile_settings.json');
			for( var i = 0; i < settingsets.length; i++){
				var setname = settingsets[i].name;
				data.settings[setname] = settings ? parseInt(settings[settingsets[i].name],10)===1 : false;
			}
			callback(null,data);
		})
	};
	profile.userSaveSettings = function(settings){
		var data = {};
		var settingsets = require('./profile_settings.json');
		for( var i = 0; i < settingsets.length; i++){
			var setname = settingsets[i].name;
			data[settingsets[i].name] = settings.settings ? settings.settings[setname] : null;
		}
		admin.profile.saveSettings(settings.uid,data,function(err){
		});
	};

	profile.profileLinks = function (links, callback) {
		links.push({
			id: "profile-extends",
			"route": "extends",
			"icon": "fa-user",
			"name": "[[profileext:extends.title]]"
		});
		callback(null, links);
	};

	profile.buildAdminHeader = function (header, callback) {
		header.plugins.push({
			"name": config.name,
			"class": "",
			"route": "/plugins/profileext"
		})
		callback(null, header);
	};

	profile.registerFields = function (customfields, callback) {
		admin.register.get(function (err, results) {
			for (var i = 0; i < results.length; i++) {
				var formSet = 'register-' + results[i].fieldName;
				customfields.push(formSet);
			}
			callback(null, customfields);
		});
	};
	profile.registerBuild = function (args, callback) {
		admin.register.get(function (err, results) {
			for (var i = 0; i < results.length; i++) {
				var formSet = createFormEntry(results[i]);
				args.templateData.regFormEntry.push(formSet);
			}
			callback(null, args);
		});
	};

	function createFormEntry(data) {
		var set = {}
		set.label = data.fieldLabel;
		set.styleName = data.fieldName;
		set.html = getFormByType(data.fieldType, 'register-' + data.fieldName, data.opts);
		return set;
	}

	function getFormByType(fieldType, fieldName, opts) {
		var supportTypes = require('./form_type_support.json');
		for (var i = 0; i < supportTypes.length; i++) {
			if (supportTypes[i].type == fieldType) {
				return genRegisterTpl(supportTypes[i].template, fieldName, JSON.parse(opts));
			}
		}
		return '';
	}

	function genRegisterTpl(tpl, fieldName, opts) {
		return templates.parse(tpl, {
			fieldName: fieldName,
			opts: opts
		});
	}
}(module.exports));
