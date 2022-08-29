const path = `${__dirname}/../../.env`
const env = require('dotenv').config({ path })

module.exports = env.parsed