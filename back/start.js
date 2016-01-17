import {Updater} from './updater'

const u = new Updater()

try{

    u
        .init()

        .then( () => u.update() )

        .then( () => console.log( 'success' ) )

        .catch( err => console.error( err, err.stack ) )


}catch( err ){ console.error( err, err.stack ) }
