"use strict";
define('admin/plugins/profileext', ['forum/infinitescroll', 'admin/modules/selectable'], function (infinitescroll, selectable) {
 var serverid = 'nodebb-plugin-profile-extends';
	var profile = {},
 validationError,
		successIcon = '<i class="fa fa-check"></i>';
	profile.init = function () {
		handleRegister();
	};

 function handleRegisterField(field,callback){

 }

	function handleInputEmpty(targetInputs) {
		var invalid = false;
		var inputcount = targetInputs ? targetInputs.length : 0;
		for (var i = 0; i < inputcount; i++) {
			var inputs = $(targetInputs[i]);
			var notifyElt = inputs.parent().find('span#' + inputs.attr('id') + '-notify');
			if (inputs.val() == '') {
				if (notifyElt.length) {
     showError(notifyElt,'[[error:invalid-data]]');
				}else{
     inputs.removeClass('alert-success')
     .addClass('alert-danger');
    }
    invalid = true;
			} else {
    if (notifyElt.length) {
     showSuccess(notifyElt,successIcon);
				}else{
     inputs.removeClass('alert-danger')
     .addClass('alert-success');
    }
			}
		}
		return !invalid;
	}

	function handleRegister() {
		var curTempalte = null;
  var rootElt = $('.register');
		var validateBaseFunc = function () {
   validationError = false;
			return handleInputEmpty($('.register input[type="text"]:visible'))
		};
  var validateOptFunc = function(){
   validationError = false;
   return handleInputEmpty($('.register.template-group input[type="text"]:visible'))
  }

  $('.register-remove').on('click',function(ev){
   var nameset = $(this).attr('data-name');
   bootbox.confirm('Do you want to delete the register field named [ '+nameset+' ]?', function (confirm) {
    if (!confirm) {
     return;
    }
    socket.emit('admin.plugins.' + serverid + '.register.remove',nameset,function(err,result){
     if (err) {
      return app.alertError(err.message);
     }
     app.alert({
      title: 'Register Field Removed',
      message: 'Field was successfully removed.',
      type: 'success',
      timeout: 2000
     });
     ajaxify.go('admin/plugins/profileext');
    });
   });
   return false;
  });

  $('.register input[type="text"]:visible').on('blur',function(){
   if(handleInputEmpty([$(this)])){
    if($(this).attr('id') == 'fieldName'){
     //to server valid
    }
   }
  });

		$('.register #clearbtn').on('click', function (ev) {
   rootElt.find('[type="text"]:visible').val('');
   rootElt.find('input[name="fieldType"]').val(['input']);
   rootElt.find('[type="submit"]').removeClass('disabled');
   //TODO clean template options
  });

		$('.register [type="submit"]').on('click', function (ev) {
   if(validateBaseFunc() && validateOptFunc()){
    var cmtdata = {};
    var opts = [];
    cmtdata.fieldName = rootElt.find('#fieldName').val();
    cmtdata.fieldLabel = rootElt.find('#fieldLabel').val();
    cmtdata.fieldType = rootElt.find('input[name="fieldType"]:checked').val();
    cmtdata.opts = opts;
    rootElt.find('.template-group input[type="text"]:visible').each(function(idx,elt){
      var didx = $(elt).attr('data-index');
      var opt = opts[didx] ? opts[didx] : opts[didx] = {};
      opt[$(elt).attr('name').replace('template-options-','')] = $(elt).val();
    });
    //send to server
    $(this).addClass('disabled');
    var holdthis = this;
    socket.emit('admin.plugins.' + serverid + '.register.add',cmtdata,function(err,result){
     $(holdthis).removeClass('disabled');
     if (err) {
      return app.alertError(err.message);
     }
     app.alert({
      title: 'Register Field Added',
      message: 'Field was successfully added.',
      type: 'success',
      timeout: 2000
     });
     ajaxify.go('admin/plugins/profileext');
    });
   }
  });

		$('.register #template-count').on('change', function (ev) {
			var line_count = $(this).val();
			var target_group = $($('.register .template-group'));
			genTemplateOptions(target_group, line_count, curTempalte);
		});

		$('.register .input-group [name="fieldType"]').on('click', function (ev) {
			var genlist = $(this).attr('genlist');
			curTempalte = $('div.template-input-row').html();
			$('.register .template-group').empty();
			if (genlist == 'true') {
				$('.register #template-count').val(1);
				$('.register div.template-form').removeClass('hidden');
    genTemplateOptions($('.register .template-group'), 1, curTempalte);
			} else {
				$('.register div.template-form').addClass('hidden');
			}
		});
	}

	function genTemplateOptions(target_group, line_count, useTemplate) {
		var cur_list = target_group.find('.row');
		var cur_count = cur_list.length;
		for (var i = line_count; i < cur_count; i++) {
			if (cur_list[i]) {
				cur_list[i].remove();
			}
		}
		for (var i = cur_count; i < line_count; i++) {
			target_group.append(useTemplate);
		}
		cur_list = target_group.find('.row');
		cur_count = cur_list.length;
		for (var i = 0; i < cur_count; i++) {
			var rownode = cur_list[i];
			var inputlabel = $(rownode).find('input.template-label');
			var inputvalue = $(rownode).find('input.template-value');
			inputlabel.attr('id', 'template-options-label' + i);
			inputlabel.attr('name', 'template-options-label');
   inputlabel.attr('data-index', i);
   inputvalue.attr('id', 'template-options-value' + i);
   inputvalue.attr('name', 'template-options-value');
   inputvalue.attr('data-index', i);
  }
	}

 function showError(element, msg) {
  translator.translate(msg, function(msg) {
   element.html(msg);
   element.parent()
   .removeClass('alert-success')
   .addClass('alert-danger');
   element.show();
  });
  validationError = true;
 }

 function showSuccess(element, msg) {
  translator.translate(msg, function(msg) {
   element.html(msg);
   element.parent()
   .removeClass('alert-danger')
   .addClass('alert-success');
   element.show();
  });
 }

	return profile;
});
