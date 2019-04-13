function normalize(types, input) {
	return types.reduce((accumulator, key) => {
		return input[key] ? [ ...accumulator, { symbol: input.symbol, type: key.toUpperCase(), ...input[key], date: input.date } ] : accumulator 
	}, [])
}

module.exports = {
	normalize
}