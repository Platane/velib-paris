try {
    const credentials = JSON.parse( process.env.GC_JSON_KEY_FILE )

    module.exports = {
        client_email    : credentials.client_email,
        private_key     : credentials.private_key,
        project_id      : credentials.project_id,
    }
}catch( err ){
    module.exports = {}
}