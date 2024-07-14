
mLoadingPlugin = {

    // consts
    LOADING_VIEW: "loadingView",

    // instance members
    OnProgress: null,
    WaitForTicks: 1,        // configure # of ticks which you expect before loading the first real plugin

    OnLoad: function() {
        mElProgress = $( "#progress" );

        progress = 0;
        progressIncrease = 100 / this.WaitForTicks;
    },

    OnLoadReady: function() {
        this.OnProgress = this.OnTick;

        Cache.Reload( this.OnProgress );

        LoadingFinished();
    },

    OnLoadingFinished: function() {
        LoadPluginWithHistory( "start" );
    },

    OnTick: function() {
        progress = parseFloat( mElProgress.ariaValueNow );

        progress += progressIncrease;   // see code below if you want to split loading into multiple stages

        // // base config
        // if ( progress < 50 ) {
        //     progress += progressIncrease;
        // }
        // // load extended data
        // else if ( progress == 50 ) {
        //     // trigger loading extended data
        // }
        // else {
        //     progress += progressIncrease;
        // }

        mElProgress.ariaValueNow = progress;
        mElProgress.style.width  = progress + "%";
        // sleep( 1000 ); // for debugging only

        if ( progress >= 100 ) {
            // store loaded data in localStorage
            Cache.Store();

            // hide loading screen
            mLoadingPlugin.OnProgress = null;
            mLoadingPlugin.OnLoadingFinished();
        }
    }
};

mCurrentPlugin = mLoadingPlugin;
