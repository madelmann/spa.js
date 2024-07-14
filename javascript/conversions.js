
var Conversions = {

    // consts
    REFRESH_RATE: 300, // in seconds

    // instance members
    currencies: [],

    Constructor: function() {
        this.Reset();
    },

    ConvertCurrency: function( from, to ) {
        if ( from == to || !from || !to ) {
            return 1;
        }

        var value = null;
        try {
            value = this.currencies[ from ][ to ];
        }
        catch {
            // we don't care about exceptions here
        }

        if( !value ) {
            this.FetchConversion( from, to );
        }

        return value;
    },

    FetchConversion: function( currencyFrom, currencyTo, callback ) {
        if ( currencyFrom == currencyTo ) {
            return;
        }

        if ( !this.currencies[ currencyFrom ] ) {
            this.currencies[ currencyFrom ] = [];
        }

        if ( !this.currencies[ currencyFrom ][ currencyTo ] ) {
            this.currencies[ currencyFrom ][ currencyTo ] = 1;
        }

        fetch( "https://min-api.cryptocompare.com/data/price?fsym=" + currencyFrom + "&tsyms=" + currencyTo )
            .then( response => {
                if ( !response.ok ) {
                    throw new Error( "HTTP error " + response.status );
                }

                return response.json();
            } )
            .then( data => {
                for ( const key in data ) {
                    if ( !this.currencies[ currencyFrom ] ) {
                        this.currencies[ currencyFrom ] = [];
                    }

                    this.currencies[ currencyFrom ][ key ] = data[ key ];
                }
            } )
            .catch( function () {
                // we don't catch this
            } );
    },

    Reset: function() {
        this.currencies = [];
        this.currencies[ "EUR" ]  = { "EUR" : 1 };
        this.currencies[ "USD" ]  = { "USD" : 1 };
        this.currencies[ "USDC" ] = { "USDC": 1 };
        this.currencies[ "USDT" ] = { "USDT": 1 };

        this.FetchConversion( "EUR", "USD" );
        this.FetchConversion( "EUR", "USDC" );
        this.FetchConversion( "EUR", "USDT" );
        this.FetchConversion( "USD", "EUR" );
        this.FetchConversion( "USD", "USDC" );
        this.FetchConversion( "USD", "USDT" );

        Refresh.Subscribe( this.UpdateConversions, this.REFRESH_RATE );
    },

    UpdateConversions: function() {
        for ( const currencyFrom in Cache.currencies ) {
            for ( const currencyTo in Cache.currencies[ currencyFrom ] ) {
                Cache.FetchConversion( currencyFrom, currencyTo );
            }
        }
    }

};
