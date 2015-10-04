
const longitude0 = 2.351828

export const project = ( lat, lng ) =>
    [
        // x
        lng - longitude0,

        //y
        Math.log( Math.tan( Math.PI/ 4 + lat/ 2 ) )
    ]
