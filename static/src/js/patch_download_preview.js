/*# encoding: utf-8
##############################################################################
#
#     patch for download preview
#     Copyright (C) 2014  zkjiao@gmail.com
# 
#     This program is free software: you can redistribute it and/or modify
#     it under the terms of the GNU Affero General Public License as
#     published by the Free Software Foundation, either version 3 of the
#     License, or (at your option) any later version.
# 
#     This program is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#     GNU Affero General Public License for more details.
# 
#     You should have received a copy of the GNU Affero General Public License
#     along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################*/
openerp.patch_download_preview = function(instance) {
	var _t = instance.web._t, _lt = instance.web._lt;
	var QWeb = instance.web.qweb;

	instance.web.Session.include({
		get_file : function(options) {
			return this.open_preview(options);
		},
		open_preview : function(options) {
			var timer, token = new Date().getTime(),
			cookie_name = 'fileToken', cookie_length = cookie_name.length,
			CHECK_INTERVAL = 1000, id = _.uniqueId('get_file_frame'),
			remove_form = false;
			remove_target = false;
			// iOS devices doesn't allow iframe use the way we do it,
			// opening a new window seems the best way to workaround
			if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
				var params = _.extend({}, options.data || {}, {token: token});
				var url = this.url(options.url, params);
				instance.web.unblockUI();
				return window.open(url);
			}
			var $form, $form_data = $('<div>');

			var complete = function () {
				if (options.complete) { options.complete(); }
				clearTimeout(timer);
				$form_data.remove();
				if (remove_form && $form) { $form.remove(); }
				if($target) { 
					if (remove_target) {
						$target.remove(); 
					}
					else {
						var body = $target.find("iframe").get(0).contentDocument.body;
						if (body.innerHTML) {
							$target.find("#preview_widget").show();
						}
						else {
							$target.remove();
						}
					}
				}				
			};

			$target = $(QWeb.render('PreviewWidget', {
				title : _lt("Preview"),
				url : "javascript:false",
				id : id,
				name : id
			})).appendTo(document.body);

			$target.find("iframe").load(function() {
				var body = this.contentDocument.body;
				if (body.innerText){
					remove_target = true;
					try {
						if (options.error) {	                        
							var node = $(body).find("p").get(0) || 
							body.childNodes[1] || body.childNodes[0];
							options.error(JSON.parse(node.textContent));
						}
					} catch(e) {
						remove_target = false;
						$(body).css("background","white");
					}
				}
				else{
					if (options.success) {
						options.success();
					}
				}
				complete();
			});
			$target.on('hidden.bs.modal', this, function() {
				$target.remove();
			});
			$target.modal({
				'backdrop' : false,
			});
			$target.modal('show');

			if (options.form) {
				$form = $(options.form);
			} else {
				remove_form = true;
				$form = $('<form>', {
					action: options.url,
					method: 'POST'
				}).appendTo(document.body);
			}

			var hparams = _.extend({}, options.data || {}, {token: token});
			if (this.override_session)
				hparams.session_id = this.session_id;

			_.each(hparams, function (value, key) {
				var $input = $form.find('[name=' + key +']');
				if (!$input.length) {
					$input = $('<input type="hidden" name="' + key + '">')
					.appendTo($form_data);
				}
				$input.val(value);
			});

			$form
			.append($form_data)
			.attr('target', id)
			.get(0).submit();

			var waitLoop = function () {
				var cookies = document.cookie.split(';');
				// setup next check
				timer = setTimeout(waitLoop, CHECK_INTERVAL);
				for (var i=0; i<cookies.length; ++i) {
					var cookie = cookies[i].replace(/^\s*/, '');
					if (!cookie.indexOf(cookie_name === 0)) { continue; }
					var cookie_val = cookie.substring(cookie_length + 1);
					if (parseInt(cookie_val, 10) !== token) { continue; }

					// clear cookie
					document.cookie = _.str.sprintf("%s=;expires=%s;path=/",
							cookie_name, new Date().toGMTString());
					if (options.success) { options.success(); }
					complete();
					return;
				}
			};
			timer = setTimeout(waitLoop, CHECK_INTERVAL);
			return;
		}
	});
};