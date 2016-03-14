export const get = ( url ) =>

    new Promise( (resolve, reject) => {

        let req = new XMLHttpRequest()
        req.open('GET', url, true)

        req.onreadystatechange = () => {
            if (req.readyState == 4){
                if (req.status == 200)
                        resolve( req.response )
                    else
                        reject('failed with status code '+req.status+' (' +url+ ')')
            }
        }

        req.send(null)

    })

    .then( x => {
        try{
            let e = JSON.parse( x )
            return e
        }catch( err ){
            return x
        }
    })
