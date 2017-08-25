const { readStdin, readFilesAt } = require('./util.js')

const args = process.argv.slice(2)
if (args[0] === '--test') {
	test()
}
else {
	read()
}

function read() {
	readStdin()
		.then(input => {
			const output = doTask(input)
			console.log(output)
		})
}

function test() {
	readFilesAt('./io/S1')
		.then(dataList => {
			dataList.forEach(data => {
				const output = doTask(data.input)
				console.log(data.inputPath, output.replace('\n', ', '))

				if (output !== data.expected) {
					console.error('-- ERROR: it should be following')
					console.error(data.expected)
					console.error('')
				}
			})
		})
		.catch(error => console.error(error))
}

/**
 * Main part!
 */
function doTask(input) {
	const dataList = parseInput(input)
	const topNames = dataList
		.sort((a, b) => calculatePreference(b) - calculatePreference(a))
		.slice(0, 2)
		.map(v => v.name)
	return topNames.join('\n')
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
	const lines = input.split('\n')
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
