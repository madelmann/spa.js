
mPlugin = {

    // consts
    DEMO_VIEW: "demo-plugins",

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
        LoadPluginWithHistory( "demo-notifications" );
    }

};

mCurrentPlugin = mPlugin;
