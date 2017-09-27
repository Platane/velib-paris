import { run } from '../index'

it(
    'should run the fetchStationAvailability module',
    () => run({ max_stations: 1 }),
    // set timeout
    120 * 1000
)
