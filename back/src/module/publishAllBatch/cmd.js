const start_date = process.argv[2] ? new Date(process.argv[2]).getTime() : null
const end_date = process.argv[3] ? new Date(process.argv[3]).getTime() : null

require('./index.js').run({ start_date, end_date })
