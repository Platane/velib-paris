import { readStationAvailability } from '../availability'
import { config } from '../../../config'

const options = {
    apiKey: process.env.JCDECAUX_API_KEY_TEST || config.JCDecauxAPI.apiKeys
}

it('should read availability for station', async () => {
    const res = await readStationAvailability(options, '4021')

    expect(typeof res.stationId).toBe('string')
    expect(typeof res.updated_date).toBe('number')
    expect(typeof res.free_slot).toBe('number')
    expect(typeof res.total_slot).toBe('number')
    expect(isFinite(res.updated_date)).toBeTruthy()
    expect(isFinite(res.free_slot)).toBeTruthy()
    expect(isFinite(res.total_slot)).toBeTruthy()
})
