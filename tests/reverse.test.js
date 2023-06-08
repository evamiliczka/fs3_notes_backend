/* eslint-disable no-undef */
// we Destruct object { reverse, average } to the variable reverse
const { reverse } = require('../utils/for_testing');

describe('reverse of', () =>
{
    test(' ', () => {
        const result = reverse('a')

        expect(result).toBe('a')
    })

    test('react', () => {
        const result = reverse('react')

        expect(result).toBe('tcaer')
    })

    test('releveler', () => {
        const result = reverse('releveler')
  
        expect(result).toBe('releveler')
    })
})