define('forum/account/profileext', ['forum/account/header'], function (header) {
	var serverid = 'plugins.nodebb-plugin-profile-extends';
	var ExtendsProfile = {};
	var fieldsTypes = null;
	ExtendsProfile.init = function () {
		header.init();

		if (!fieldsTypes) {
			socket.emit(serverid + '.fields', {}, function (err, results) {
				fieldsTypes = {};
				for (var n in results) {
					fieldsTypes[n] = {};
					results[n].forEach(function (field, idx) {
						fieldsTypes[n][field.fieldName] = field;
					});
				}
				formatFieldsForm();
			});
		} else {
			formatFieldsForm();
		}
	};

	function formatFieldsForm() {
		var infototal = parseInt(ajaxify.variables.get('infototal'), 10);
		var infocomplete = parseInt(ajaxify.variables.get('infocomplete'), 10);
		var infoprogress = infocomplete/infototal * 100;
		$('.complate-progress-bar').attr('aria-valuenow',infoprogress);
		$('.complate-progress-bar').css('width',infoprogress+'%');
		$('.complate-progress-bar').html(infocomplete+' / '+ infototal);


		$('.submitBtn').on('click', function () {
			$this = $(this);
			var pack = $this.attr('form').replace('-form', '');
			var data = readFieldsValue($this.attr('form'));
			socket.emit(serverid + '.' + pack + '.save', {
				uid: ajaxify.variables.get('theirid'),
				data: data
			}, function (err) {
				if (err) {
					return app.alertError(err.message);
				}
				app.alertSuccess('[[success:settings-saved]]');
				if (parseInt(app.uid, 10) === parseInt(ajaxify.variables.get('theirid'), 10)) {
					ajaxify.refresh();
				}
			});
			return false;
		});


		$('.controls').each(function () {
			var $this = $(this);
			if ($this.find('#' + $this.attr('fields-name')).length == 0) {
				createFieldsForm($this.attr('form').replace('-form', ''), $this.attr('fields-type'), $this.attr('fields-name'), $this.attr('fields-value'), function (html) {
					$this.html(html);
				});
			}
		});
		syncFieldsValue();

		$('input.number').on('keyup',function(){
			$(this).val($(this).val().replace(/[^0-9\.]/g,''));
		});
	}

	function readFieldsValue(form) {
		var result = {};
		$('.' + form).find('input, textarea, select').each(function (id, input) {
			input = $(input);
			var fieldName = input.attr('data-property');
			if (input.is('select')) {
				result[fieldName] = input.val();
				return;
			}
			switch (input.attr('type')) {
			case 'text':
			case 'textarea':
				result[fieldName] = input.val();
				break;
			case 'radio':
				result[fieldName] = result[fieldName] || (input.is(':checked') ? input.val() : null);
				break;
			case 'checkbox':
				result[fieldName] = result[fieldName] || (input.is(':checked') ? input.val() : null);
				break;
			}
		});
		return result;
	}

	function syncFieldsValue() {
		$('.controls').each(function () {
			var $this = $(this);
			var input = $this.find('[data-property="' + $this.attr('fields-name') + '"]');
			if (input.length > 0) {
				input.val([$this.attr('fields-value')]);
			}
		});
	}

	function createFieldsForm(pack, type, name, value, callback) {
		if (fieldsTypes[pack] && fieldsTypes[pack][type]) {
			var fieldType = fieldsTypes[pack][type].fieldType;
			var fieldLabel = fieldsTypes[pack][type].fieldLabel;
			$('.control-label[for="' + name + '"]').html(fieldLabel);
			var tpl = $('#fields-template-' + fieldType).html();
			var content = '';
			switch (fieldType) {
			case 'input':
				content = tpl.replace(/\{name\}/g, name)
					.replace(/\{label\}/g, fieldLabel)
					.replace(/\{value\}/g, '');
				break;
			case 'number':
				content = tpl.replace(/\{name\}/g, name)
					.replace(/\{label\}/g, fieldLabel)
					.replace(/\{value\}/g, '');
				break;
			case 'radio':
			case 'checkbox':
				var opts = jQuery.parseJSON(fieldsTypes[pack][type].opts);
				for (var i = 0; i < opts.length; i++) {
					content += tpl.replace(/\{name\}/g, name)
						.replace(/\{label\}/g, opts[i].label)
						.replace(/\{value\}/g, opts[i].value);
				}
				break;
				default:
					console.info('missing field type:',fieldType);
					break;
			}
			callback(content);
		} else {
			callback(name + '=' + value);
		}
	}
	return ExtendsProfile;
});
