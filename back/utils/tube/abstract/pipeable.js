

export class Tube {

    constructor(){

        this._out       = null
        this._in        = null
        this._outBuffer = []
    }

    pipe( tube ){
        this._out   = tube
        tube._in    = this

        return tube
    }

}
