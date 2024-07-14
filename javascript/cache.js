
var Cache = {

    // CONSTS

    // instance members
    // here you can add your instance members that you want to fetch and cache
    time: null,
    validated: false,

    Constructor: function() {
        this.Retrieve();
    },

    FetchDateTime: function( callback ) {
        Parameters.clear();

        fetch( "https://bitbroker.michaeladelmann.at/api/v1/time/" )
            .then( response => {
                if ( !response.ok ) {
                    throw new Error( "HTTP error " + response.status );
                }

                return response.json();
            } )
            .then( json => {
                this.time = response;

                if ( callback ) {
                    callback();
                }
            } )
            .catch( function() {
                callback();
            } );
    },

    Reload: function( OnProgress ) {
        // fetch data which does not depend on anything loaded yet

        this.FetchDateTime( OnProgress );   // this is an example of asynchronous data loading during startup
    },

    Retrieve: function() {
        if ( !localStorage.cache ) {
            return;
        }

        var cache = JSON.parse( localStorage.cache );
        if ( !cache ) {
            return;
        }

        this.time  = cache.time;
        this.validated = true;
    },

    Store: function() {
        localStorage.cache = JSON.stringify( this );
    }

};
