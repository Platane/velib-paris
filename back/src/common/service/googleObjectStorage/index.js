import googleapis               from 'googleapis'

const log = require('debug')('gos')


const getAuth   = options =>
    new Promise( (resolve, reject) => {
        const auth = new googleapis.auth.JWT(

            // mail
            options.client_email,

            //
            null,

            // account private
            options.private_key,

            // scopes
            [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/datastore',
            ]
        )
        auth.authorize( err => err ? reject( err ) : resolve( auth ) )
    })

const connect = ( options= {} ) =>
    getAuth( options )
        .then( auth =>{

            const projectId = options.project_id

            const ds = googleapis.datastore({
                auth,
                projectId,
                version     : 'v1',
                params      : { projectId },
            })

            return {
                commit      : ( resource ) => {
                    log( `commit ${ resource.mutations.length } mutations` )
                    return new Promise( (resolve, reject) =>
                        ds.projects
                            .commit(
                                { resource },
                                (err, res) => err ? reject( err ) : resolve( res )
                            )
                    )
                },

                runQuery    : ( resource ) => {
                    log( `query ${ JSON.stringify( resource.query ) }` )
                    return new Promise( (resolve, reject) =>
                        ds.projects
                            .runQuery(
                                { resource },
                                (err, res) => err ? reject( err ) : resolve( res )
                            )
                    )
                },

            }
        })

module.exports = connect