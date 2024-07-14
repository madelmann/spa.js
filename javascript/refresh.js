
var Refresh = {

    refreshRate: 1000, // in seconds
    subscribers: [],

    Constructor: function() {
        this.__loop__();
    },

    Subscribe: function( method, interval = 60 ) {
        for ( var idx = 0; idx < this.subscribers.length; ++idx ) {
            if ( this.subscribers[ idx ].method == method ) {
                // method has already been added
                return;
            }
        }

        // add subscriber with given interval
        this.subscribers.push( { "method": method, "interval": this.refreshRate * interval } );
    },

    Unsubscribe: function( method ) {
        for ( var idx = 0; idx < this.subscribers.length; ++idx ) {
            if ( this.subscribers[ idx ].method == method ) {
                // remove method from refresh subscribers
                this.subscribers.splice( idx, 1 );
            }
        }
    },

    __loop__: function( interval = 0 ) {
        // auto refresh
        setTimeout( () => {

            this.__loop__( this.refreshRate + interval );

        }, this.refreshRate );

        for ( var idx = 0; idx < this.subscribers.length; ++idx ) {
            var subscriber = this.subscribers[ idx ];

            if ( interval % subscriber.interval != 0 ) {
                // interval does not match
                continue;
            }

            try {
                if ( subscriber.method ) {
                    subscriber.method();
                }
            }
            catch ( e ) {
                console.log( e );
            }
        }
    }

}