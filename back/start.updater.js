import {Updater} from './updater'

const u = new Updater()

console.log('updater')


const loop = () => {

    console.log('try to update ...')

    u.update()

       .then( () => console.log( 'update successful' ) )

       .catch( err => console.error( err, err.stack ) )

       .then( () => setTimeout( loop, 1000 * 60 * 20 ) )
}

u
    .init()

    .then( () => loop() )

    .catch( err => console.error( err, err.stack ) )
