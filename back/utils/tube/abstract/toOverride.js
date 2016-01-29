import {Tube as Parent } from './flow'

export class Tube extends Parent {

    _start(){
        this._in.forEach( inn => inn.__start() )
    }

    _dataEnded( ){
        this.end()
    }

    _dataAvailable( ){
        console.log( 'union')
        let x
        while ( x = this.pull() )
            this.push( x )
    }
}
