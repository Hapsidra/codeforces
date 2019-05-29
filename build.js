var fs = require('fs')
var path = require('path')
var p = path.join('build', '.nojekyll')
fs.openSync(p, 'w')