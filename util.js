const fs = require('fs')

function readTextFile(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, 'utf8', (err, data) => {
			if (err) {
				reject(err)
			}
			else {
				const text = data.replace(/\r\n/g, '\n').trim()
				resolve({ path, text })
			}
		})
	})
}

function readFilesAt(dir, filter) {
	return new Promise((resolve, reject) => {
		fs.readdir(dir, 'utf8', (err, files) => {
			if (err) {
				console.error('Directory not found.')
				reject(err)
				return
			}

			const tasks = files.filter(v => /\d\.in$/.test(v))
				.map(fileName => {
					const path = dir + '/' + fileName
					return Promise.all([
						readTextFile(path),
						readTextFile(outputFileNameFromInputFileName(path)),
					])
						.then(([input, output]) => {
							return {
								input: input.text,
								inputPath: input.path,
								expected: output.text,
								outputPath: output.path,
							}
						})
				})

			Promise.all(tasks)
				.then(resolve)
		})
	})
}

function outputFileNameFromInputFileName(inputFileName) {
	return inputFileName.replace(/\.in$/, '.out')
}

module.exports = {
	readTextFile,
	readFilesAt,
}
