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

    constructor( accept, delay=0, concurency=1 ){
        super()
        this.accept     = typeof accept == 'function' ? accept : x => x == accept
        this.delay      = delay
        this.concurency = concurency
        this.n          = 0
    }

    onDataReady(){

        if ( this.n >= this.concurency )
            return

        const x = this.pull()

        if ( !x )
            return

        this.n ++

        const resolve = () => {
            this.n --
            if ( this.accept( x.data ) ) {
                this.push( x.data )
                x.ack()
            } else
                x.ack( true )

            this.onDataReady()
        }

        if ( this.delay )
            setTimeout( resolve, this.delay )

        else
            resolve()
    }
}

describe('concurency', () => {

    it('simple flow', () => {

        const c1 = new Transformer( () => true )
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
        c1.pipe( collector )

        return collector.start()
            .then( () => expect( collector.stack.length ).toBe(6) )


    })

    it('fork with filter', () => {

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

    // it('fork with filter and delay', () => {
    //
    //     const c1 = new Transformer( x => x[0] == 'A', 5 )
    //     const c2 = new Transformer( x => x[0] == 'B', 5 )
    //     const collector = new Collector
    //     const producer = new Tube
    //
    //     producer.onReady = () =>
    //         producer
    //             .push('A1')
    //             .push('B2')
    //             .push('B3')
    //             .push('A4')
    //             .push('B5')
    //             .push('A6')
    //             .end()
    //
    //
    //     producer.pipe( c1 )
    //     producer.pipe( c2 )
    //     c1.pipe( collector )
    //     c2.pipe( collector )
    //
    //     c1.name = 1
    //     c2.name = 2
    //
    //     return collector.start()
    //         .then( () => expect( collector.stack.length ).toBe(6) )
    //
    // })

})
