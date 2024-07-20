
mPlugin = {

    // consts
    DEMO_VIEW: "demo-convenience-api-acccess",

    // instance members

    OnLoad: function() {
        mElConversions = $( "#conversions > tbody" );

        Refresh.Subscribe( this.Autorefresh, 10 );
    },

    OnLoadReady: function() {
        this.Autorefresh();

        LoadingFinished();
    },

    OnUnload: function() {
        Refresh.Unsubscribe( this.Autorefresh );
    },

    Autorefresh: function() {
        getExternal(
            "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USDC",
            ( data ) => {
                mElConversions.innerHTML = Templates.clone( "template-conversion" )
                                            .bind( "FROM", 1 )
                                            .bind( "TO", data[ "USDC" ] )
                                            .str();
            },
            ( error ) => {
                notifyError( "Could not get conversion for BTC to USDC" );
            } );
    },

    NextDemo: function() {
        LoadPluginWithHistory( "demo-convenience-controls" );
    },

    Reload: function() {
        this.Autorefresh();
    }

};

mCurrentPlugin = mPlugin;
