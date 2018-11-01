const App = require('../models/app')

class AppHelper{
    static configure(appId, keys) {
        return new App(appId, keys)
    }
}

module.exports = AppHelper