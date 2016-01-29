

export class Tube {

    constructor(){

        this._out       = []
        this._in        = []
        this._outBuffer = []

        this._started   = false
        this._ended     = 0
    }

    __start(){
        if ( this._started )
            return

        this._started   = true
        this._ended     = 0
        this._start()
    }

    __dataEnded(){
        this._ended ++
        if ( this._ended < this._in.length )
            return

        this._started   = false
        this._dataEnded()
    }

    pipe( tube ){
        this._out.push( tube )
        tube._in.push( this )

        return tube
    }

    unpipe( ){
        // TODO
    }

}
