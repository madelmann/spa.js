
History = {

	Constructor: function( pluginName = null ) {
		history.replaceState( { name: pluginName }, "", "" );

		mCallbackFailed = null;
		mCallbackSuccess = null;

		mCurrentIndex = -1;
		mData = new Array();
		mElBackward = null;
		mElForward = null;

		window.onpopstate = function( event ) {
			if ( event.state && event.state.id !== null ) {
				History.Go( event.state.id );
			}
		}
	},

	Destructor: function() {
		mData = new Array();
	},

	Backward: function() {
		if ( mCurrentIndex > 0 ) {
			mCurrentIndex--;

			History.LoadPlugin();
		}
	},

	Clear: function() {
		mData = [];
	},

	Forward: function() {
		if ( mCurrentIndex < mData.length ) {
			mCurrentIndex++;

			History.LoadPlugin();
		}
	},

	Go: function( index ) {
		if ( index < 0 || index > mData.length - 1 ) {
			return;
		}

		mCurrentIndex = index;

		History.LoadPlugin();
	},

	LoadPlugin: function() {
		var entry = mData[ mCurrentIndex ];
		if ( !entry ) {
			return;
		}

		Parameters.clear();

		for ( var idx = 0; idx < entry.pluginData.length; ++idx ) {
			Parameters.add( entry.pluginData[ idx ].name, entry.pluginData[ idx ].value );
		}

		LoadPlugin( entry.pluginName );
	},

	PushState: function( pluginName ) {
		mCurrentIndex++;

		var entry = { id: mCurrentIndex, pluginName: pluginName, pluginData: Parameters.mParams };

		// through every after mCurrentIndex away
		mData = mData.slice( 0, mCurrentIndex );

		// push new data
		mData.push( entry );

		// add new entry to browser history
		history.pushState( entry, "", "" );
	},

	Refresh: function() {
		History.LoadPlugin();
	},

	UpdateButtons: function() {
		if ( !mElBackward )	mElBackward = document.getElementById( "backward" );
		if ( !mElForward )	mElForward = document.getElementById( "forward" );

		if ( mCurrentIndex <= 0 ) {
			if ( mElBackward ) mElBackward.classList.add( "disabled" );
		}
		else {
			if ( mElBackward ) mElBackward.classList.remove( "disabled" );
		}
		
		if ( mCurrentIndex >= mData.length - 1 ) {
			if ( mElForward ) mElForward.classList.add( "disabled" );
		}
		else {
			if ( mElForward ) mElForward.classList.remove( "disabled" );
		}
	}

}

