
mPlugin = {

    // consts
    DEMO_VIEW: "demo-refresh-timer",

    // instance members

    OnLoad: function() {
        Refresh.Subscribe( this.Autorefresh, 1 );
    },

    OnLoadReady: function() {
        this.Autorefresh();

        LoadingFinished();
    },

    OnUnload: function() {
        Refresh.Unsubscribe( this.Autorefresh );
    },

    Autorefresh: function() {
        var elTimer = $( "#timer" );

        elTimer.innerHTML = Templates.clone( "template-timer" )
                                .bind( "DATETIME", new Date() )
                                .str();
    },

    NextDemo: function() {
        LoadPluginWithHistory( "demo-history-api-access" );
    }

};

mCurrentPlugin = mPlugin;
