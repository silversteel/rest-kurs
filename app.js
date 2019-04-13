const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const app = express()
const routers = require('./routers')
const PORT = process.env.PORT || 7000;

console.log(process.env.NODE_ENV)

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api', routers)
app.use(function(req, res, next) {
	res.status(404).send({ message: 'Resources not found' })
})

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

module.exports = server