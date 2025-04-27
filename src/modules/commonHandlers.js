export function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
  }

export const findShip = (ships,x,y)=>{
    return ships.find((s) =>{ return s.position.some((pos) => { return pos[0] == x && pos[1] == y })})
}