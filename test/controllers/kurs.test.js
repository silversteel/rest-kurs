const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../app')
const should = chai.should()
const { Kurs } = require('../../models')

chai.use(chaiHttp)

describe('Kurs', () => {
	describe('/GET indexing', () => {
		it('should GET kurs from external source', (done) => {
			chai.request(app)
				.get('/api/indexing')
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.status.should.be.eql('stored')
					done()
				})
		})
	})
	describe('/GET kurs (by range of date)', () => {
		it('should GET kurs in 2019-04-09 until 2019-04-11', (done) => {
			chai.request(app)
				.get('/api/kurs?startdate=2019-04-09&enddate=2019-04-11')
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.data.should.be.a('array')
					done()
				})
		})
	})
	describe('/GET kurs (by range of date and symbol)', () => {
		it('should GET MYR kurs in 2019-04-09 until 2019-04-11', (done) => {
			chai.request(app)
				.get('/api/kurs/MYR?startdate=2019-04-09&enddate=2019-04-11')
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.data.should.be.a('array')
					done()
				})
		})
	})
	describe('/POST kurs', () => {
		it('should POST new kurs', (done) => {
			const kurs = {
				"symbol": "ASA",
				"e_rate": {
					"jual": 12001,
					"beli": 880
				},
				"tt_counter": {
					"jual": 8999,
					"beli": 9280
				},
				"bank_notes": {
					"jual": 2921,
					"beli": 1929
				},
				"date": "2018-05-05"
			}
			chai.request(app)
				.post('/api/kurs')
				.send(kurs)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.data.should.be.a('array')
					done()
				})
		})
	})
	describe('/PUT kurs', () => {
		it('should PUT selected kurs', (done) => {
			const kurs = {
				symbol: "ASA",
				e_rate: {
					jual: 999,
					beli: 999
				},
				tt_counter: {
					jual: 999,
					beli: 999
				},
				bank_notes: {
					jual: 999,
					beli: 999
				},
				date: "2018-05-05"
			}
			chai.request(app)
				.put('/api/kurs')
				.send(kurs)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.data.should.be.a('array')
					done()
				})
		})
	})
	describe('/DELETE kurs', () => {
		it('should DELETE kurs in 2019-04-11', (done) => {
			chai.request(app)
				.delete('/api/kurs/2019-04-11')
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					done()
				})
		})
	})
})