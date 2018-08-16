const fs = require('fs');
const path = require('path');
const Redirect = require(path.join(process.cwd(), 'Documentation/js/redirect.js')).Redirect;
let r = new Redirect();
alert(r.name)
