///////////////////////////////////////////////////////////////////////////////
// mGlobals

var mCurrentPlugin = {};
var mPlugin;
var mPluginCSS;
var mPluginHTML;
var mPluginLoading;
var mPluginScript;
var mRefreshRate = 60; // in seconds
var mRefreshSubscribers = [];

// mGlobals
///////////////////////////////////////////////////////////////////////////////

function __main__()
{
    __init__();

	Cache.Retrieve();

    API.Constructor();
    Translations.Constructor();
    History.Constructor();
    Notifications.Constructor();

    // determine storage capabilities
    if ( typeof( Storage ) !== "undefined" ) {
        // Code for localStorage/sessionStorage.

        Account.Constructor();
    }

	Refresh.Constructor();
	Refresh.Subscribe( FetchUserMessage, 600 );

	mPluginLoading = $( "#plugin_loading" );
	mPluginMain    = $( "#main" );
}

///////////////////////////////////////////////////////////////////////////////
// Event handling

function OnAbort( event )
{
	// request execution aborted

	if ( mPlugin && mPlugin.OnAbort ) {
		mPlugin.OnAbort( event );
		return;
	}

	var message = "";

	if ( event.currentTarget && event.currentTarget.responseText ) {
		message = event.currentTarget.responseText;
	}
	else {
		message = event.message;
	}

	Notifications.notifyWarning( message );
}

function OnAbortIgnored( event )
{
	// we ignore this error
}

function OnError( event )
{
	// request execution failed

	if ( mPlugin && mPlugin.OnError ) {
		mPlugin.OnError( event );
		return;
	}

	var message = "";

	if ( event.currentTarget && event.currentTarget.responseText ) {
		message = event.currentTarget.responseText;
	}
	else {
		message = event.message;
	}

	Notifications.notifyError( message );
}

function OnErrorIgnored( event )
{
	// we ignore this error
}

function OnLoadReady( event )
{
	// loading is done
	if ( mPlugin && mPlugin.OnLoadReady ) {
		mPlugin.OnLoadReady( event );
		return;
	}

	// nothing to do here
}

function OnSuccess( event )
{
	// everything is okay
	if ( mPlugin && mPlugin.OnSuccess ) {
		mPlugin.OnSuccess( event );
		return;
	}

	// nothing to do here
}

// Event handling
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Account handling

function Login()
{
	elPassword     = $( "#password" );
	elStayLoggedIn = $( "#stay_logged_in" );
	elUsername     = $( "#username" );

	Account.Login( elUsername.value, elPassword.value, elStayLoggedIn.checked, OnLoginSuccess, OnLoginFailed );
}

function Logout()
{
	Account.Logout( OnLogoutSuccess );
}

function Register()
{
	Parameters.clear();

	LoadPluginWithHistory( "registerView" );
}

function ResetPassword()
{
	Parameters.clear();

	LoadPluginWithHistory( "resetPasswordView" );
}

// Account handling
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Plugin: Home

function FetchUserMessage()
{
	fetch( "user-message.json" )
		.then( response => {
			if ( !response.ok ) {
				throw new Error( "HTTP error " + response.status );
			}

			return response.json();
		} )
		.then( json => {
			if ( json.time > Globals.vm.stats.pageLoadedAt ) {
				if ( mElUserMessage ) {
					mElUserMessage.innerHTML = json.message;

					Translations.translate( mElUserMessage );
				}
			}
		} )
		.catch( function () {
			// we don't catch this
		} );
}

function LoadingFinished()
{
	if ( mPluginLoading ) mPluginLoading.classList.add( "hidden" );
	if ( mPluginMain )    mPluginMain.classList.remove( "hidden" );
}

function LoadingStarted()
{
	if ( mPluginLoading ) mPluginLoading.classList.remove( "hidden" );
	if ( mPluginMain )    mPluginMain.classList.add( "hidden" );
}

// Plugin: Home
///////////////////////////////////////////////////////////////////////////////
