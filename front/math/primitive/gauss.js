
const u = 1/Math.sqrt( 2 * Math.PI )

export const gauss = (tau, x) =>
    (u / tau) * Math.exp( - 0.5* (x*x)/(tau*tau) )


export const gaussInv = (tau, y) =>
    Math.sqrt( - 2 * tau*tau * Math.log(  y * tau / u  ) )
