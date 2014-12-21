"use strict";

(function (module, nodebb) {
	//nodebb 3rd modules
	module.S = nodebb.require('string');
	module.async = nodebb.require('async');
	module.nconf = nodebb.require('nconf');
	module.winston = nodebb.require('winston');
	module.validator = nodebb.require('validator');
	//core modules
	module.db = nodebb.require('./database');
	module.settings = nodebb.require('./settings');
	module.meta = nodebb.require('./meta');
	module.privileges = nodebb.require('./privileges');
	//community core
	module.User = nodebb.require('./user');
	module.Groups = nodebb.require('./groups');
	module.Posts = nodebb.require('./posts');
	module.Topics = nodebb.require('./topics');
	module.Categories = nodebb.require('./categories');
	//utils
	module.helpers = nodebb.require('./controllers/helpers');

	module.templates = nodebb.require('templates.js');
	module.translator = nodebb.require('../public/src/translator');
	module.translator = nodebb.require('../public/src/translator');
	module.utils = nodebb.require('../public/src/utils');
	//extends
	module.Plugins = nodebb.require('./plugins');
	module.WebSockets = nodebb.require('./socket.io/index');
	module.SocketPlugins = nodebb.require('./socket.io/plugins');
	module.SocketAdmin = nodebb.require('./socket.io/admin').plugins;

	module.getUserDataByUserSlug = function (userslug, callerUID, callback) {
		var async = module.async,
			utils = module.utils,
			meta = module.meta,
			groups = module.Groups,
      websockets = module.WebSockets,
			user = module.User,
			plugins = module.Plugins;
		user.getUidByUserslug(userslug, function (err, uid) {
			if (err) {
				return callback(err);
			}

			if (!uid) {
				return callback(null, null);
			}

			async.parallel({
				userData: function (next) {
					user.getUserData(uid, next);
				},
				userSettings: function (next) {
					user.getSettings(uid, next);
				},
				isAdmin: function (next) {
					user.isAdministrator(callerUID, next);
				},
				followStats: function (next) {
					user.getFollowStats(uid, next);
				},
				ips: function (next) {
					user.getIPs(uid, 4, next);
				},
				profile_links: function (next) {
					plugins.fireHook('filter:user.profileLinks', [], next);
				},
				groups: function (next) {
					groups.getUserGroups([uid], next);
				}
			}, function (err, results) {
				if (err || !results.userData) {
					return callback(err || new Error('[[error:invalid-uid]]'));
				}

				var userData = results.userData;
				var userSettings = results.userSettings;
				var isAdmin = results.isAdmin;
				var self = parseInt(callerUID, 10) === parseInt(userData.uid, 10);

				userData.joindate = utils.toISOString(userData.joindate);
				userData.lastonline = userData.lastonline ? utils.toISOString(userData.lastonline) : userData.joindate;
				userData.age = userData.birthday ? Math.floor((new Date().getTime() - new Date(userData.birthday).getTime()) / 31536000000) : '';

				if (!(isAdmin || self || (userData.email && userSettings.showemail))) {
					userData.email = '';
				}

				userData.emailClass = (self && !userSettings.showemail) ? '' : 'hide';

				if (!self && !userSettings.showfullname) {
					userData.fullname = '';
				}

				if (isAdmin || self) {
					userData.ips = results.ips;
				}

				userData.uid = userData.uid;
				userData.yourid = callerUID;
				userData.theirid = userData.uid;
				userData.isSelf = self;
				userData.showSettings = self || isAdmin;
				userData.groups = Array.isArray(results.groups) && results.groups.length ? results.groups[0] : [];
				userData.disableSignatures = meta.config.disableSignatures !== undefined && parseInt(meta.config.disableSignatures, 10) === 1;
				userData['email:confirmed'] = !!parseInt(userData['email:confirmed'], 10);
				userData.profile_links = results.profile_links;
				userData.status = websockets.isUserOnline(userData.uid) ? (userData.status || 'online') : 'offline';
				userData.banned = parseInt(userData.banned, 10) === 1;
				userData.websiteName = userData.website.replace('http://', '').replace('https://', '');
				userData.followingCount = results.followStats.followingCount;
				userData.followerCount = results.followStats.followerCount;

				callback(null, userData);
			});
		});
	};
	module.checkVersion = function (version) {
		var semver = nodebb.require('semver');
		var pkg = nodebb.require('../package.json');
		if (!semver.gtr(pkg.version.replace('-dev', ''), version)) {
			return false;
		}
		return true;
	}
}(module.exports, module.parent.parent.parent));
