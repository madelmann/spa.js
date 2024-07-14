
mPlugin = {

    // consts
    DEMO_VIEW: "demo-start",

    // instance members

    OnLoad: function() {
        Refresh.Subscribe( this.Autorefresh, 1 );
    },

    OnLoadReady: function() {
        LoadingFinished();
    },

    NextDemo: function() {
        LoadPluginWithHistory( "demo-templates" );
    }

};

mCurrentPlugin = mPlugin;
