
mPlugin = {

    // consts
    DEMO_VIEW: "demo-history-api-access",

    // instance members

    OnLoad: function() {
        // nothing to do here
    },

    OnLoadReady: function() {
        LoadingFinished();
    },

    OnUnload: function() {
        // nothing to do here
    },

    NextDemo: function() {
        LoadPluginWithHistory( "demo-convenience-api-acccess" );
    }

};

mCurrentPlugin = mPlugin;
