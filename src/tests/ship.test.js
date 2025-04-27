import {Ship} from '../modules/ship.js'

describe('ship test', () => {
    let ship 
    beforeEach(() => {
        ship = new Ship(3)
    })
    test('should initialise with correct properties', ()=>{
        expect(ship.length).toBe(3)
        expect(ship.hits).toBe(0)
        expect(ship.sunk).toBe(false)
    })
    test('should register hit and not sink until enough hits', ()=>{
        ship.hit()
        expect(ship.hits).toBe(1)
        expect(ship.isSunk()).toBe(false)
        ship.hit()
        expect(ship.hits).toBe(2)
        expect(ship.isSunk()).toBe(false)
    })
    test('sink when enough hits', ()=>{
        ship.hit()
        ship.hit()
        ship.hit()
        expect(ship.isSunk()).toBe(truetrue)
    })
})