import expect       from 'expect'
import Tube         from '../../src/common/utils/tube/base'

class Collector extends Tube {

    constructor(){
        super()
        this.stack = []
    }

    onDataReady(){
        const {data, ack} = this.pull()
        this.stack.push( data )
        ack()
    }
}

class Transformer extends Tube {

    constructor( accept, delay=0 ){
        super()
        this.accept = typeof accept == 'function' ? accept : x => x == accept
        this.delay = delay
    }

    onDataReady(){
        const {data, ack} = this.pull()

        const resolve = () => {
            if ( this.accept( data ) ) {
                this.push( data )
                ack()
            } else
                ack( true )
        }

        if ( this.delay )
            setTimeout( resolve, this.delay )

        else
            resolve()
    }
}

describe('alternative consumer flow', () => {

    it('flow fork, no reject', () => {

        const c1 = new Transformer( () => true )
        const c2 = new Transformer( () => true )
        const collector = new Collector
        const producer = new Tube

        producer.onReady = () =>
            producer
                .push('A1')
                .push('B2')
                .push('B3')
                .push('A4')
                .push('B5')
                .push('A6')
                .end()


        producer.pipe( c1 )
        producer.pipe( c2 )
        c1.pipe( collector )
        c2.pipe( collector )

        return collector.start()
            .then( () => expect( collector.stack.length ).toBe(6) )
    })

    it('flow fork, each branch accept one of the type', () => {

        const c1 = new Transformer( x => x[0] == 'A' )
        const c2 = new Transformer( x => x[0] == 'B' )
        const collector = new Collector
        const producer = new Tube

        producer.onReady = () =>
            producer
                .push('A1')
                .push('B2')
                .push('B3')
                .push('A4')
                .push('B5')
                .push('A6')
                .end()


        producer.pipe( c1 )
        producer.pipe( c2 )
        c1.pipe( collector )
        c2.pipe( collector )

        return collector.start()
            .then( () => expect( collector.stack.length ).toBe(6) )
    })

    it('flow fork, each branch accept one of the type, with delay', () => {

        const c1 = new Transformer( x => x[0] == 'A', 5 )
        const c2 = new Transformer( x => x[0] == 'B', 5 )
        const collector = new Collector
        const producer = new Tube

        producer.onReady = () =>
            producer
                .push('A1')
                .push('B2')
                .push('B3')
                .push('A4')
                .push('B5')
                .push('A6')
                .end()


        producer.pipe( c1 )
        producer.pipe( c2 )
        c1.pipe( collector )
        c2.pipe( collector )

        return collector.start()
            .then( () => expect( collector.stack.length ).toBe(6) )
    })

})
