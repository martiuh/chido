// Since a html file is ignore by babel, manually move default-html
const fse = require('fs-extra')

fse.copySync('src/default-html', 'lib/default-html')
