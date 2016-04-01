import expect       from 'expect'
import Tube         from '../../src/common/utils/tube/base'
import Transformer  from '../../src/common/utils/tube/transformer'

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

describe('transformer', () => {

    it('synchrone transform', () => {

        const collector     = new Collector
        const producer      = new Tube
        const transformer   = new Transformer( a => a.toLowerCase() )

        producer.onReady = () =>
            producer
                .push('A')
                .push('B')
                .push('C')
                .end()


        producer
            .pipe( transformer )
            .pipe( collector )

        return collector.start()
            .then( () => expect( collector.stack ).toEqual(['a','b','c']) )
    })

    it('asynchrone transform', () => {

        const collector     = new Collector
        const producer      = new Tube
        const transformer   = new Transformer( a => Promise.resolve( a.toLowerCase() ) )

        producer.onReady = () =>
            producer
                .push('A')
                .push('B')
                .push('C')
                .end()


        producer
            .pipe( transformer )
            .pipe( collector )

        return collector.start()
            .then( () => expect( collector.stack ).toEqual(['a','b','c']) )
    })

    it('asynchrone transform with soft failure', () => {

        const collector     = new Collector
        const producer      = new Tube

        const stack         = []
        const transformer   = new Transformer(
            a =>
                stack.push( a ) &&
                a=='B' && stack.length < 5
                    ? Promise.reject()
                    : Promise.resolve( a.toLowerCase() )
        )

        producer.onReady = () =>
            producer
                .push('A')
                .push('B')
                .push('C')
                .end()


        producer
            .pipe( transformer )
            .pipe( collector )

        return collector.start()
            .then( () => {

                expect( stack.reduce( (sum,x) => sum+(x=='B'), 0 ) ).toBe( 3 )

                expect( collector.stack ).toContain('a')
                expect( collector.stack ).toContain('b')
                expect( collector.stack ).toContain('c')
            })
    })

    it('asynchrone transform with delay', () => {

        const collector     = new Collector
        const producer      = new Tube

        const transformer   = new Transformer(
            a =>
                new Promise( resolve => setTimeout( () => resolve( a.toLowerCase() ) ), 20 )
        )

        producer.onReady = () =>
            producer
                .push('A')
                .push('B')
                .push('C')
                .end()


        producer
            .pipe( transformer )
            .pipe( collector )

        return collector.start()
            .then( () => {

                expect( collector.stack ).toEqual(['a','b','c'])
            })
    })

    it('asynchrone transform with delay and concurency', () => {

        const collector     = new Collector
        const producer      = new Tube

        const transformer   = new Transformer(
            a =>
                new Promise( resolve => setTimeout( () => resolve( a.toLowerCase() ) ), 20 )
        )
        transformer.concurency = 1

        producer.onReady = () =>
            producer
                .push('A')
                .push('B')
                .push('C')
                .end()


        producer
            .pipe( transformer )
            .pipe( collector )

        return collector.start()
            .then( () => {

                expect( collector.stack ).toEqual(['a','b','c'])
            })
    })

})
