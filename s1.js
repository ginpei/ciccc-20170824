const fs = require('fs')

const dir = './io/S1'

fs.readdir(dir, 'utf8', (err, files) => {
	if (err) {
		console.error('Directory not found.')
		return
	}

	const tasks = files
		.filter(v => /\.in$/.test(v))
		.map(v => doTask(`${dir}/${v}`))

	Promise.all(tasks)
		.then(results => {
			results.forEach((result, index) => {
				console.log(result.inputFileName, '--------------------------------')
				console.log('-- expected')
				console.log(result.expected)
				console.log('-- output')
				console.log(result.output)
				if (result.success) {
					console.log('--- OK ---')
				}
				else {
					console.log('--- ERROR', '================================')
				}
				console.log('')
			})
		})
		.catch(error => {
			console.error('ERROR', error)
		})
})

/**
 * Main part!
 */
function doTask(inputFileName) {
	const outputFileName = inputFileName.replace(/\.in$/, '.out')

	return readTextFile(inputFileName)
		.then(text => parseInput(text))
		.then(dataList => {
			// dataList.forEach(v => console.log(calculatePreference(v), v))
			const topNames = dataList
				.sort((a, b) => calculatePreference(b) - calculatePreference(a))
				.slice(0, 2)
				.map(v => v.name)
			// console.log(topNames)
			return topNames.join('\n')
		})
		.then(output => {
			return readTextFile(outputFileName)
				.then(expected => ({expected, output}))
		})
		.then(({ expected, output }) => {
			return {
				expected: expected.trim().replace(/\r\n/, '\n'),
				output: output.trim().replace(/\r\n/, '\n'),
			}
		})
		.then(({ expected, output }) => {
			const success = expected === output
			return { expected, inputFileName, output, success }
		})
}

function readTextFile(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, 'utf8', (err, data) => {
			if (err) {
				reject(err)
			}
			else {
				resolve(data)
			}
		})
	})
}

/**
 * @example
 * const input = [
 *   '2',
 *   'Commodore 0 99 3',
 *   'Atari 0 100 0',
 * ].join('\r\n')
 * const output = parseInput(input)
 * console.assert(output.length === 2)
 * console.assert(output[0].name === 'Commodore')
 * console.assert(output[0].ram === 0)
 * console.assert(output[0].cpu === 99)
 * console.assert(output[0].disk === 3)
 */
function parseInput(input) {
	const lines = input.split('\r\n')
	const data = lines
		.slice(1)
		.filter(v => v)
		.map(line => {
			const [name, ram, cpu, disk] = line.split(' ')
			return {
				cpu: Number(cpu),
				disk: Number(disk),
				name: name,
				ram: Number(ram),
			}
		})
	return data
}

/**
 * Value = 2 * R + 3 * S + D
 */
function calculatePreference(data) {
	return 2 * data.ram + 3 * data.cpu + data.disk
}
