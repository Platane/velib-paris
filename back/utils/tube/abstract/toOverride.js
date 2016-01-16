import {Tube as Parent } from './flow'

export class Tube extends Parent {

    /**
     * requireData
     *
     * @ to override
     *
     */
    _start(){
        this._in && this._in._start()
    }

    /**
     * processData
     *
     * @ to override
     *
     * process data, push it's done
     * call requireData or return true to have more data
     *
     */
    processData( x ){

        return true
    }

    _dataEnded( ){

        // const x = this.pull()
        //
        // this.push( x )
    }
    _dataAvailable( ){

        // const x = this.pull()
        //
        // this.push( x )
    }
}
