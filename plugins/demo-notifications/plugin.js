
mPlugin = {

    // consts
    DEMO_VIEW: "demo-notifications",

    // instance members

    OnLoad: function() {
        // nothing to do here
    },

    OnLoadReady: function() {
        LoadingFinished();

        notifySuccess( "SUCCESS", false );
        notifyInfo( "INFORMATION", true );
        notifyWarning( "WARNING", false );
        notifyError( "ERROR", true );
    },

    OnUnload: function() {
        // nothing to do here
    },

    NextDemo: function() {
        LoadPluginWithHistory( "demo-refresh-timer" );
    }

};

mCurrentPlugin = mPlugin;
