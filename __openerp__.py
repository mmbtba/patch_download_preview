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
{
    "name": "下载预览补丁",
    "version": "1.0",
    "depends": ["base", "web"],
    "author": "西安-beyond,zkjiao@gmail.com",
    "category": "Generic Modules/Base",
    'summary': "补丁",
    'website':"",
    "description": """
优化补丁
=======================
* 下载预览补丁
    """,
    'data': [
        "views/patch_download_preview.xml"
        ],
    'qweb': [ 
        "static/src/xml/*.xml",       
        ],
    'installable': True,
    'auto_install': False,
}