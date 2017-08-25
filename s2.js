const { readFilesAt } = require('./util.js')

readFilesAt('./io/S2')
	.then(dataList => {
		dataList.forEach(data => {
			const decoded = doTask(data.input)
			console.log(data.inputPath, decoded);
		})
	})
	.catch(error => console.error(error))

function doTask(input) {
	const { codecPairs, encoded } = parse(input)
	const length = encoded.length
	let decoded = ''
	for (let i = 0; i < length; ) {
		const partial = encoded.slice(i)
		const codec = codecPairs.find(codec => {
			return partial.startsWith(codec.code)
		})
		if (codec) {
			decoded += codec.letter
			i += codec.code.length
		}
		else {
			throw new Error('Code doesn\'t match with anything.')
		}
	}

	return decoded
}

function parse(input) {
	const lines = input.split('\n')
	const numbers = lines[0]
	const encoded = lines[lines.length - 1]

	const codecPairs = lines.slice(1, lines.length - 1)
		.map(line => {
			const [letter, code] = line.split(' ')
			return { letter, code }
		}, {})

	return { numbers, encoded, codecPairs }
}
