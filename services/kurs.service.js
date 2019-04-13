const cheerio = require('cheerio')
const moment = require('moment')
const request = require('request')
const Op = require('sequelize').Op

const { Kurs } = require('../models')
const { kursUtil } = require('../utils')
const { sourceUrl } = require('../config')

const storeExternalKurs = async function() {
	try {
		const getExtData = new Promise(function(resolve, reject){
			request(sourceUrl, function(err, res, html) {
				if(!err && res.statusCode == 200) {
					$ = cheerio.load(html)
					table = $('.kurs-e-rate')

					header = table.find('thead')
					ext_kurs_type = header.find('tr').first().children().slice(1).map(function(i, elem) {
						const type = $(this).text().toUpperCase().match(/^[A-Za-z\s\-]+/g).toString().replace(/[\s\-]/g, '_')
						const date = $(this).text().match(/\d{2} \w+ \d{4}/g).toString()
						return { type, date }
					}).get()

					body = table.find('tbody')
					ext_kurs_data = body.find('tr').map(function(i, elem) {
						const data = $(this).find('td').map(function(i, elem) {
							return $(this).text()
						}).get()
						return { symbol: data[0], data: data.slice(1) }
					}).get()

					response	= []
					for (const { symbol, data } of ext_kurs_data) {
						for (const [ i, { type, date } ] of ext_kurs_type.entries()) {
							response.push({
								symbol,
								jual: data[(2*i)],
								beli: data[(2*i)+1],
								type,
								date: moment(date, 'DD MMM YYYY').format('YYYY-MM-DD')
							})
						}
					}
					resolve(response)
				} else {
					reject({ code: 500, message: 'Cannot get data from external resource' })
				}
			})
		})

		const ext_kurs = await getExtData
		const kurs = await Kurs.findAll({
			where: {
				date: {
					[Op.eq]: moment().format('YYYY-MM-DD')
				}
			}
		})

		const result = {
			code: 200, 
			status: 'skipped',
			data: ext_kurs
		}

		if(kurs.length < 1) {
			result.code = 200,
			result.status = 'stored'
			result.data = await Kurs.bulkCreate(ext_kurs)
		}

		return result
	} catch(e) {
		throw e
	}
}

const getKurs = async function(startdate, enddate, symbol = '') {
	try {
		let where_condition = []

		if (symbol.length > 0) {
			where_condition = [...where_condition, {
				symbol: {
					[Op.eq]: symbol
				}
			}]
		}

		where_condition = [...where_condition, {
			date: {
				[Op.between]: [startdate, enddate]
			}
		}]

		const kurs = await Kurs.findAll({
			where: {
				[Op.and]: where_condition
			}
		})

		return kurs
	} catch(e) {
		throw e
	}
}

const insertKurs = async function(input) {
	try {
		const normalized_data = kursUtil.normalize(['e_rate', 'tt_counter','bank_notes'], input)
		const kurs = await Kurs.findAll({
			where: {
				[Op.and]: {
					symbol: {
						[Op.eq]: input.symbol
					},
					date: {
						[Op.eq]: input.date
					}
				}
			}
		})

		const result = {
			code: 200,
			status: 'skipped',
			data: []
		}

		if(kurs.length < 1) {
			result.code = 200
			result.status = 'stored'
			result.data = await Kurs.bulkCreate(normalized_data)
		}

		return result
	} catch(e) {
		throw e
	}
}

const updateKurs = async function(input) {
	try {
		const normalized_data = kursUtil.normalize(['e_rate', 'tt_counter','bank_notes'], input)
		const kurs = await Kurs.findAll({
			where: {
				[Op.and]: {
					symbol: {
						[Op.eq]: input.symbol
					},
					date: {
						[Op.eq]: input.date
					}
				}
			}
		})

		const result = {
			code: 404,
			status: 'not_found',
			data: []
		}

		if(kurs.length > 0) {
			for(let [i, data] of normalized_data.entries()) {
				const result = await Kurs.update(data, { 
					where: {
						id: {
							[Op.eq]: kurs[i].id
						}
					} 
				})
			}
			result.code = 200
			result.status = 'updated'
			result.data = await Kurs.findAll({
				where: {
					[Op.and]: {
						symbol: {
							[Op.eq]: input.symbol
						},
						date: {
							[Op.eq]: input.date
						}
					}
				}
			})
		}

		return result
	} catch(e) {
		throw e
	}
}

const deleteKurs = async function(date) {
	try {
		const kurs = await Kurs.findAll({
			where: {
				date: {
					[Op.eq]: date
				}
			}
		})

		const result = {
			code: 404,
			status: 'not_found'
		}

		if(kurs.length > 0) {
			await Kurs.destroy({
				where: {
					date: {
						[Op.eq]: date
					}
				}
			})
			result.code = 200
			result.status = 'deleted'
		}

		return result
	} catch(e) {
		throw e
	}
}

module.exports = {
	storeExternalKurs,
	getKurs,
	insertKurs,
	updateKurs,
	deleteKurs
}