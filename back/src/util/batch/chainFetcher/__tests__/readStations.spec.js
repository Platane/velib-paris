import { createFetcher } from '../index';

it('should fetch array', async () => {
    const res = await createFetcher([
        x => Promise.resolve('a' + x),
        x => Promise.resolve('b' + x),
    ])([1, 2, 3, 4]);

    expect(res.length).toBe(4);
});

it('should fetch until all the fetchers fails', async () => {
    let a = 3;
    let b = 4;

    const res = await createFetcher([
        x => (a-- > 0 ? Promise.resolve('a') : Promise.reject('no')),
        x => (b-- > 0 ? Promise.resolve('b') : Promise.reject('no')),
    ])(Array.from({ length: 20 }, (_, i) => i + 1));

    expect(res.filter(x => x === 'a')).toEqual(['a', 'a', 'a']);
    expect(res.filter(x => x === 'b')).toEqual(['b', 'b', 'b', 'b']);
});
