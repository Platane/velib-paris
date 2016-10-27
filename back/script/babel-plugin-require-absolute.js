const fs = require('fs')
const pathUtils = require('path')


const fileExist = function( path ){
    try{
        fs.accessSync( path )
        return true
    } catch( err ){
        return false
    }
}

const moduleExist = function( path ){
    return path.slice(-3) != '.js'
        ? fileExist( path+'.js' ) || fileExist( path+'/index.js' )
        : fileExist( path )
}

/**
 *
 * @param cwd               {string}       path from where the command is called
 * @param moduleDirectory   {[]string}     list of path from where to check for modules ( relative to cwd )
 * @param src               {string}       the source as specified by the require
 * @param filename          {string}       the filename ( with path ) from where the require is
 *
 * @return {string} the path to the module found, relative to the path of the current file
 *                  or src if nothing is found
 */
const getRelativePath = function( cwd, moduleDirectory, src, filename ){

    src = src.trim()

    // ignore this cases
    if ( !src || src[0] == '.' || src[0] == '/' )
        return src

    // the directory of the current file in absolute ( from where to write the relative path )
    const fromDirectory = pathUtils.resolve( cwd, pathUtils.dirname( filename ) )

    moduleDirectory = moduleDirectory || [ 'web_modules']

    // test the existence of the file in each rootDirectory
    // if it exist in two directories, the first in the list have the priority
    for( var i=moduleDirectory.length; i--; ) {

        var k   = 0
        var ex
        var absolute = ''

        while( ex != absolute ) {

            ex = absolute
            absolute = pathUtils.join( fromDirectory, '../'.repeat( k ), moduleDirectory[i], src )

            k++

            if ( ex == absolute )
                break

            else if ( moduleExist( absolute ) )
                return './'+pathUtils.relative( fromDirectory, absolute )

        }
    }

    return src
}

module.exports = function ( a ) {

    const cwd = process.cwd()

    return {
        visitor:{
            CallExpression: function( path, parent ){

                if ( path.node.callee.name == 'require' ) {
                    const arg = path.node.arguments[ 0 ]

                    arg.value = getRelativePath(
                        cwd,
                        parent.opts && parent.opts.moduleDirectory,

                        arg.value,

                        // /!\ sometimes the filename is absolute, sometimes not, I can't figure out why
                        parent.file.opts.filename
                    )
                }
            },

            ImportDeclaration: function( path, parent ) {

                path.node.source.value = getRelativePath(
                    cwd,
                    parent.opts && parent.opts.moduleDirectory,

                    path.node.source.value,

                    // /!\ sometimes the filename is absolute, sometimes not, I can't figure out why
                    parent.file.opts.filename
                )

            }
        }
    }
}
