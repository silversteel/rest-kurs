const router = require('express').Router()
const moment = require('moment')
const { query, param, body } = require('express-validator/check')
const { kurs } = require('./controllers')

router.get('/indexing', kurs.getExternalSource)

router.get('/kurs', query(['startdate', 'enddate'])
		.exists()
		.custom((value) => {
			return moment(value, 'YYYY-MM-DD', true).isValid()
		}), kurs.getKursBetween)

router.get('/kurs/:symbol', [
		param('symbol').custom((value) => {
			return /^\w{3}$/.test(value)
		}),
		query(['startdate', 'enddate'])
			.exists()
			.custom((value) => {
				return moment(value, 'YYYY-MM-DD', true).isValid()
			})
	], kurs.getKursBySymbol)

router.post('/kurs', [
	body('date')
		.exists()
		.custom((value) => {
			return moment(value, 'YYYY-MM-DD', true).isValid()
		}),
	body('symbol').custom((value) => {
			return /^\w{3}$/.test(value)
		}),
	body(['e_rate', 'tt_counter', 'bank_notes']).custom((value) => {
		return /^[0-9\.\,]+$/.test(value.jual.toString()) && /^[0-9\.\,]+$/.test(value.beli.toString())
	})
], kurs.addKurs)

router.put('/kurs', [
	body('date')
		.exists()
		.custom((value) => {
			return moment(value, 'YYYY-MM-DD', true).isValid()
		}),
	body('symbol').custom((value) => {
			return /^\w{3}$/.test(value)
		}),
	body(['e_rate', 'tt_counter', 'bank_notes']).custom((value) => {
		return /^[0-9\.\,]+$/.test(value.jual.toString()) && /^[0-9\.\,]+$/.test(value.beli.toString())
	})
], kurs.editKurs)

router.delete('/kurs/:date', param('date')
	.custom((value) => {
		return moment(value, 'YYYY-MM-DD', true).isValid()
	})
, kurs.removeKurs)

module.exports = router