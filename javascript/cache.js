
var Cache = {

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
        // fetch public data
        this.FetchDateTime( OnProgress );   // this is an example of asynchronous data loading during startup

        // fetch private data
        // this.FetchSettings( OnProgress );
    },

    Retrieve: function() {
        if ( !localStorage.cache ) {
            // invalid cache!
            return;
        }

        var cache = JSON.parse( localStorage.cache );
        if ( !cache ) {
            // invalid cache!
            return;
        }

        this.time  = cache.time;
        this.validated = true;
    },

    Store: function() {
        localStorage.cache = JSON.stringify( this );
    }

};
