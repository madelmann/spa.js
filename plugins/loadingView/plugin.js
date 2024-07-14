
mLoadingPlugin = {

    // consts
    LOADING_VIEW: "loadingView",

    // instance members
    OnProgress: null,
    WaitForTicks: 1,        // configure # of ticks which you expect before loading the first real plugin

    OnLoad: function() {
        mElProgress = $( "#progress" );

        progress = 0;
        progressIncrease = 50 / this.WaitForTicks;      // first half of progress
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

        // process base data
        progress += progressIncrease;   // see code below if you want to split loading into multiple stages

        // // process base data
        // if ( progress < 50 - progressIncrease ) {
        //     progress += progressIncrease;
        // }
        // // fetch extended data
        // else if ( progress < 51 ) {
        //     progress = 50;

        //     progressIncrease = 50 / numberOfTicksForSecondHalfOfProgress;     // second half of progress

        //     // trigger loading extended data
        // }
        // // process extended data
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
