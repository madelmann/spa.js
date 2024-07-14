
mPlugin = {

    // consts
    DEMO_VIEW: "demoView",

    // instance members

    OnLoad: function() {
        Refresh.Subscribe( this.Autorefresh, 1 );
    },

    OnLoadReady: function() {
        // your plugin startup done code goes here...

        this.Autorefresh();

        LoadingFinished();
    },

    Autorefresh: function() {
        var elTimer = $( "#timer" );

        elTimer.innerHTML = Templates.clone( "template-timer" )
                                .bind( "DATETIME", new Date() )
                                .str();
    }

};

mCurrentPlugin = mPlugin;
