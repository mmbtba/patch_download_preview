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
			var token = new Date().getTime();
			var id = _.uniqueId('get_file_frame');

			var params = _.extend({}, options.data || {}, {
				token : token
			});
			var url = this.url(options.url, params);
			// iOS devices doesn't allow iframe use the way we do it,
			// opening a new window seems the best way to workaround
			if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
				instance.web.unblockUI();
				return window.open(url);
			}
			$preview = $(QWeb.render('PreviewWidget', {
				title : _lt("Preview"),
				url : url,
				id : id,
				name : id
			})).appendTo(document.body);
			$preview.find("iframe").load(function() {
				var body = this.contentDocument.body;
				if (body.innerText){
					try {
	                    if (options.error) {	                        
	                        var node = body.childNodes[1] || body.childNodes[0];
	                        options.error(JSON.parse(node.textContent));
	                    }
	                } finally {
	                	if (options.complete) {
							options.complete();
						}
	                	$preview.remove();
	                }
				}
				else{
					$preview.find(".preview_header").show();
					if (options.success) {
						options.success();
					}
					if (options.complete) {
						options.complete();
					}
				}
			});
			$preview.on('hidden.bs.modal', this, function() {
				$preview.remove();
			});
			$preview.modal({
				'backdrop' : false,
			});
			$preview.modal('show');
			return;
		}
	});
};