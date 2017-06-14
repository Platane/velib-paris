import { readStations } from '../stations';

it('should read stations', async () => {
    const res = await readStations({});

    expect(res.length).toBeGreaterThan(1000);
    res.forEach(x => {
        expect(typeof x.id).toBe('string');
        expect(typeof x.address).toBe('string');
        expect(typeof x.name).toBe('string');
        expect(typeof x.coordinates[0]).toBe('number');
        expect(typeof x.coordinates[1]).toBe('number');
    });
});
