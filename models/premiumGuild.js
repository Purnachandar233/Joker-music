const m = require('mongoose')

module.exports = m.model('premiumGuild', new m.Schema({

    Guild: String,
    Expire: Number,
    Permanent: Boolean

}))