# encoding: utf-8
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
##############################################################################
from openerp.models import AbstractModel
from openerp.http import Response

class patch_download_preview(AbstractModel):
    _inherit = 'ir.http' 
    #Do not touch _name it must be same as _inherit
    #_name = 'ir.http'
    def _dispatch(self):
        result = super(patch_download_preview, self)._dispatch()
        if isinstance(result, Response):
            if result.status_code == 200:
                if result.mimetype == "application/pdf":
                    result.headers['Content-Disposition'] = \
                        result.headers['Content-Disposition'].replace(
                            'attachment', 'inline')
                    pass
                pass
            pass
        return result;