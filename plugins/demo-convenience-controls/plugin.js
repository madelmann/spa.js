
mPlugin = {

    // consts
    DEMO_VIEW: "demo-convenience-controls",

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
        LoadPluginWithHistory( "demo-end" );
    }

};

mCurrentPlugin = mPlugin;