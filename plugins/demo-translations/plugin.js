
mPlugin = {

    // consts
    DEMO_VIEW: "demo-translations",

    // instance members
    data : {
        transactions: [
            {
                amount: 10,
                broker: "Binance",
                instrumentCode: "BTC/USD",
                price: 58123.45,
                side: "SELL",
                time: new Date(),
                type: null
            }
        ]
    },
    pagination: {
        currentPage: 1,
        numPages: 1,
    },

    OnLoad: function() {
        mElTransactions = $( "#transactions > tbody" );
    },

    OnLoadReady: function() {
        this.RenderTransactions( this.data );

        LoadingFinished();
    },

    OnUnload: function() {
        // nothing to do here
    },

    NextDemo: function() {
        LoadPluginWithHistory( "demo-plugins" );
    },

    Reload: function() {
        this.RenderTransactions( this.data );
    },

    RenderTransactions: function( data ) {
        if ( !data.transactions.length ) {
            mElTransactions.innerHTML = Templates.clone( "template-transaction-row-default" ).str();

            Translations.translate( mElTransactions );

            return;
        }

        var listItems = "";

        for ( idx = 0; idx < data.transactions.length; ++idx ) {
            var entry = data.transactions[ idx ];

            listItems += Templates.clone( "template-transaction-row" )
                            .bind( "AMOUNT", Translations.number( entry.amount ) )
                            .bind( "BROKER", entry.broker )
                            .bind( "INSTRUMENT_CODE", entry.instrumentCode )
                            .bind( "PRICE", Translations.number( entry.price ) )
                            .bind( "SIDE", entry.side.toLowerCase() )
                            .bind( "TIME", entry.time )
                            .bind( "TYPE", entry.type )
                            .str();
        }

        mElTransactions.innerHTML = listItems;

        Translations.translate( mElTransactions );

        this.pagination = data.pagination;

        Pagination( this.pagination );
    },

    SwitchLanguage: function() {
        var elLanguage = $( "#language_selection" );
        var language = elLanguage.value;

        // update HTML page language attribute
        document.documentElement.setAttribute( "lang", language.toLowerCase() );

        Translations.loadLanguage( language );

        this.RenderTransactions( this.data );
    }

};

mCurrentPlugin = mPlugin;
