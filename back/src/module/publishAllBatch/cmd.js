const start_date = process.argv[1] ? new Date(process.argv[1]).getTime() : null
const end_date = process.argv[2] ? new Date(process.argv[2]).getTime() : null

require('./index.js').run({ start_date, end_date })
