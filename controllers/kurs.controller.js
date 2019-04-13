const { kursService } = require('../services')
const { validationResult} = require('express-validator/check')
const { storeExternalKurs, getKurs, insertKurs, updateKurs, deleteKurs } = kursService

const getExternalSource = async function(req, res, next) {
	try {
		const result = await storeExternalKurs()
		res.status(result.code).json(result)
	} catch(e) {
		res.status(e.code || 500).json({ status: 'error', message: e.message || 'Something went wrong' })
	}
}

const getKursBetween = async function(req, res, next) {
 	try {
 		const errors = validationResult(req)

 		if (!errors.isEmpty()) {
 			throw { code: 400, message: 'Bad Request' }
 		}

 		const { startdate, enddate } = req.query
 		const data = await getKurs(startdate, enddate)

 		res.status(200).json({data})
 	} catch(e) {
		res.status(e.code || 500).json({ message: e.message || 'Something went wrong' }) 	
 	}
}

const getKursBySymbol = async function(req, res, next) {
 	try {
 		const errors = validationResult(req)

 		if (!errors.isEmpty()) {
 			throw { code: 400, message: 'Bad Request' }
 		}

 		const { startdate, enddate } = req.query
 		const { symbol } = req.params

 		const data = await getKurs(startdate, enddate, symbol)
 		res.status(200).json({data})
 	} catch(e) {
		res.status(e.code || 500).json({ message: e.message || 'Something went wrong' }) 	
 	}	
}

const addKurs = async function(req, res, next) {
	try {
		const errors = validationResult(req)

 		if (!errors.isEmpty()) {
 			throw { code: 400, message: 'Bad Request' }
 		}

		const input = req.body
		const result = await insertKurs(input)
		res.status(result.code).json(result)
	} catch(e) {
		res.status(e.code || 500).json({ message: e.message || 'Something went wrong' }) 	
	}
}

const editKurs = async function(req, res, next) {
	try {
		const errors = validationResult(req)

 		if (!errors.isEmpty()) {
 			throw { code: 400, message: 'Bad Request' }
 		}

		const input = req.body
		const result = await updateKurs(input)
		res.status(result.code).json(result)
	} catch(e) {
		res.status(e.code || 500).json({ message: e.message || 'Something went wrong' }) 	
	}
}

const removeKurs = async function(req, res, next) {
	try {
		const errors = validationResult(req)

 		if (!errors.isEmpty()) {
 			throw { code: 400, message: 'Bad Request' }
 		}

		const { date } = req.params
		const result = await deleteKurs(date)
		res.status(result.code).json(result)
	} catch(e) {
		res.status(e.code || 500).json({ message: e.message || 'Something went wrong' })
	}
}

module.exports = {
	getExternalSource,
	getKursBetween,
	getKursBySymbol,
	addKurs,
	editKurs,
	removeKurs
}