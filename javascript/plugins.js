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

var mElFooter;
var mElHeader;
var mElNavigation;
var mElUserMessage;

// mGlobals
///////////////////////////////////////////////////////////////////////////////

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

function OnLoad()
{
    // Initializing components
    // {
    // Plugins
    mPluginCSS     = $( "#plugin_css" );
    mPluginHTML    = $( "#plugin_html" );
    mPluginLoading = $( "#plugin_loading" );
    mPluginScript  = $( "#plugin_script" );
    // }

    window.onpopstate = function( event ) {
        if ( event.state && event.state.id !== null ) {
            History.Go( event.state.id );
        }
    }

    mElFooter      = $( "#footer" );
    mElHeader      = $( "#header" );
    mElNavigation  = $( "#navigation" );
    mElUserMessage = $( "#user-message" );

    if ( mElFooter ) LoadPluginInto( "footer", mElFooter );
    if ( mElHeader ) LoadPluginInto( "header", mElHeader );
    // if ( mElNavigation ) LoadPluginInto( "navigation", mElNavigation );

    LoadPlugin( "loadingView", OnLoadReady );
}

// function OnLoadReady( event )
// {
//     // loading is done
//     if ( mPlugin && mPlugin.OnLoadReady ) {
//         mPlugin.OnLoadReady( event );
//         return;
//     }

//     // nothing to do here
// }

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
    if ( mPluginHTML ) mPluginHTML.classList.remove( "hidden" );
}

function LoadingStarted()
{
    if ( mPluginLoading ) mPluginLoading.classList.remove( "hidden" );
    if ( mPluginHTML ) mPluginHTML.classList.add( "hidden" );
}

function ScrollToBottom()
{
    if ( mElFooter ) {
        mElFooter.scrollIntoView();
    }
}

function ScrollToTop()
{
    if ( mElHeader ) {
        mElHeader.scrollIntoView();
    }
}

// Plugin: Home
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Generic plugin loading

function __loadPluginCSS( pluginName, target, forceCacheRefresh )
{
    if ( pluginName.length === 0 ) {
        return false;
    }

    var root = target ? target : document.body;

    var pluginURL = API.__buildPluginUrl__( pluginName + "/style.css", false );

    var pluginCSS = document.createElement( "link" );
    pluginCSS.setAttribute( "rel", "stylesheet" );
    pluginCSS.setAttribute( "type", "text/css" );
    pluginCSS.setAttribute( "href", pluginURL );
    root.appendChild( pluginCSS );

    return true;
}

function __loadPluginHTML( pluginName, target, forceCacheRefresh )
{
    if ( pluginName.length === 0 ) {
        mPluginHTML.innerHTML = "";
        mPluginHTML.style.border = "0px";

        return false;
    }

    var xmlhttp = null;

    if ( window.XMLHttpRequest ) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {  // code for IE6, IE5
        xmlhttp = new ActiveXObject( "Microsoft.XMLHTTP" );
    }

    xmlhttp.onreadystatechange = function() {
        if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
            if ( !target ) {
                return;
            }

            if ( target == mPluginHTML ) {
                Globals.vm.plugin = xmlhttp.responseText;
            }
            else {
                target.innerHTML = xmlhttp.responseText;
            }

            Translations.translate( target );
        }
    };

    // optionally use index.os, index.php or index.html
    var pluginURL = API.__buildPluginUrl__( pluginName + "/", true );

    xmlhttp.onerror = OnError;
    xmlhttp.onabort = OnAbort;
    xmlhttp.open( "POST", pluginURL, false );
    xmlhttp.send();

    return true;
}

function __loadPluginJS( pluginName, target, callback, forceCacheRefresh )
{
    if ( pluginName.length === 0 ) {
        return false;
    }

    var root = target ? target : document.body;

    var pluginURL = API.__buildPluginUrl__( pluginName + "/plugin.js", false );

    var pluginJS = document.createElement( "script" );
    pluginJS.onload = pluginJS.onreadystatechange = function() {
        if ( mCurrentPlugin && mCurrentPlugin.OnLoad ) {
            mCurrentPlugin.OnLoad( callback );
            mCurrentPlugin.OnLoadReady( callback );
            mCurrentPlugin = {};

            Translations.translate( target );
        }
        //pluginJS.onload = pluginJS.onreadystatechange = null;
    };

    pluginJS.setAttribute( "type", "text/javascript" );
    pluginJS.setAttribute( "src", pluginURL );
    root.appendChild( pluginJS );

    return true;
}

function __loadPluginTemplateHTML( pluginName, target, forceCacheRefresh )
{
    if ( pluginName.length === 0 ) {
        mPluginHTML.innerHTML = "";
        mPluginHTML.style.border = "0px";

        return false;
    }

    var xmlhttp = null;

    if ( window.XMLHttpRequest ) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {  // code for IE6, IE5
        xmlhttp = new ActiveXObject( "Microsoft.XMLHTTP" );
    }

    xmlhttp.onreadystatechange = function() {
        if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
            if ( !target ) {
                return;
            }

            if ( target == mPluginHTML ) {
                Globals.vm.plugin += xmlhttp.responseText;
            }
            else {
                target.innerHTML += xmlhttp.responseText;
            }

            Translations.translate( target );
        }
    };

    // optionally use index.os, index.php or index.html
    var pluginURL = API.__buildPluginUrl__( pluginName + "/templates.html", true );

    xmlhttp.onerror = OnError;
    xmlhttp.onabort = OnAbort;
    xmlhttp.open( "POST", pluginURL, false );
    xmlhttp.send();

    return true;
}

function LoadPlugin( pluginName, callback, forceCacheRefresh )
{
    if ( mPlugin && mPlugin.pluginName == pluginName ) {
        // plugin is already running
        return;
    }

    if ( mPlugin && mPlugin.OnUnload ) {
        mPlugin.OnUnload();
    }

    // show loading spinner
    LoadingStarted();

    // and automatically deactivate it after some time has passed,
    // in case the plugin hadn't deactivated is already
    setTimeout( () => { LoadingFinished(); }, 1000 * 3 );

    Parameters.add( "v", APP_VERSION );

    if ( Globals.Debug ) {
        var notification = document.createElement( "div" );
        notification.innerHTML += "<p>" + Parameters.toString() + "</p>";
        mPluginHTML.appendChild( notification );
    }

    mPlugin = null;

    forceCacheRefresh = false;

    __loadPluginHTML( pluginName, mPluginHTML, forceCacheRefresh );
    __loadPluginTemplateHTML( pluginName, mPluginHTML, forceCacheRefresh );
    __loadPluginCSS( pluginName, mPluginHTML, forceCacheRefresh );
    __loadPluginJS( pluginName, mPluginHTML, null, forceCacheRefresh );

    if ( callback ) {
        callback();
    }
}

function LoadPluginInto( pluginName, target, immediateCallback, asyncCallback )
{
    __loadPluginHTML( pluginName, target );
    __loadPluginTemplateHTML( pluginName, target );
    __loadPluginCSS( pluginName, target );
    __loadPluginJS( pluginName, target, asyncCallback );

    if ( immediateCallback ) {
        immediateCallback();
    }
}

function LoadPluginWithHistory( pluginName, callback )
{
    History.PushState( pluginName );

    LoadPlugin( pluginName, callback );
}

// Generic plugin loading
///////////////////////////////////////////////////////////////////////////////
