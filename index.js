
const cachedEntities = {
    languages: [],
    plugin: null,
    renderComponent: true,
    settings: null,
    stats: {
        pageLoadedAt: null
    },
    template: null
};


///////////////////////////////////////////////////////////////////////////////
// User event handling

function OnLoadReady()
{
    Globals.Admin = false;
    Globals.Debug = false;

    API.Constructor( "", "api", "https", "" );
}

function OnLoginFailed( event )
{
    alert( "OnLoginFailed()" );

    // your code goes here...

    notifyError( "LOGIN_FAILED" );
}

function OnLoginSuccess( event )
{
    alert( "OnLoginSuccess()" );

    // your code goes here...

    LoadPlugin( "start" );
}

function OnLogout()
{
    alert( "OnLogout()" );

    // your code goes here...

    notifySuccess( "LOGOUT_SUCCESS" );
}

function OnLogoutFailed( event )
{
    alert( "OnLogoutFailed()" );

    // your code goes here...
}

function OnLogoutSuccess( event )
{
    alert( "OnLogoutSuccess()" );

    // your code goes here...

    LoadPlugin( "loginView" );
}

// User event handling
///////////////////////////////////////////////////////////////////////////////

