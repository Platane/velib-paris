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

    _dataEnded( ){
        this.end()
    }

    _dataAvailable( ){

        // const x = this.pull()
        //
        // this.push( x )
    }
}
