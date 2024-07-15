
// convenience API access
function execute( pluginFunc, callbackSuccess = OnSuccess, callbackError = OnErrorIgnored, callbackAbort = OnAbortIgnored )
{
    return API.execute( pluginFunc, callbackSuccess, callbackError, callbackAbort );
}

// HTTP methods
function get( pluginFunc, callbackSuccess = OnSuccess, callbackError = OnErrorIgnored, callbackAbort = OnAbortIgnored )
{
    return API.get( pluginFunc, callbackSuccess, callbackError, callbackAbort );
}
function getExternal( pluginFunc, callbackSuccess = OnSuccess, callbackError = OnErrorIgnored, callbackAbort = OnAbortIgnored )
{
    return API.external( pluginFunc, callbackSuccess, callbackError, callbackAbort, "GET" );
}
function patch( pluginFunc, callbackSuccess = OnSuccess, callbackError = OnErrorIgnored, callbackAbort = OnAbortIgnored )
{
    return API.post( pluginFunc, callbackSuccess, callbackError, callbackAbort, "PATCH" );
}
function post( pluginFunc, callbackSuccess = OnSuccess, callbackError = OnErrorIgnored, callbackAbort = OnAbortIgnored )
{
    return API.post( pluginFunc, callbackSuccess, callbackError, callbackAbort );
}
function postExternal( pluginFunc, callbackSuccess = OnSuccess, callbackError = OnErrorIgnored, callbackAbort = OnAbortIgnored )
{
    return API.external( pluginFunc, callbackSuccess, callbackError, callbackAbort, "POST" );
}


API = {

    postfix: "",
    prefix: "api",
    protocol: "https",
    version: "v1",

    Constructor: function( prefix, postfix, protocol, version ) {
        this.prefix   = prefix   ? prefix   : "";
        this.postfix  = postfix  ? postfix  : "";
        this.protocol = protocol ? protocol : "";
        this.version  = version  ? version  : "";
    },

    execute: function( pluginFunc, callbackSuccess, callbackError = OnErrorIgnored, callbackAbort = OnAbortIgnored ) {
        if ( pluginFunc.length === 0 ) {
            return false;
        }

        var pluginURL = API.__buildPluginUrl__( pluginFunc, true );
    
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.addEventListener( "abort", callbackAbort, false );
        xmlhttp.addEventListener( "error", callbackError, false );
        xmlhttp.addEventListener( "load", callbackSuccess, false );
        xmlhttp.open( "POST", pluginURL, true );
        xmlhttp.send();

        return true;
    },

    external: function( apiURL, callbackSuccess, callbackError = OnErrorIgnored, callbackAbort = OnAbortIgnored, method ) {
        fetch( apiURL, {
            Method: method,
            Headers: {
              Accept: "application.json",
              "Content-Type": "application/json"
            },
            // Body: body,
            Cache: "default"
          } )
            .then( response => {
                if ( !response.ok ) {
                    throw new Error( "HTTP error " + response.status );
                }

                return response.json();
            } )
            .then( json => {
                callbackSuccess( json );
            } )
            .catch( error => {
                callbackError( error );
            } );
    },

    fetch: function( pluginFunc, callbackSuccess, callbackError = OnErrorIgnored, callbackAbort = OnAbortIgnored ) {
        if ( pluginFunc.length === 0 ) {
            return false;
        }

        var pluginURL = this.__buildApiUrl__( pluginFunc, true );

        fetch( pluginURL )
            .then( response => {
                if ( !response.ok ) {
                    throw new Error( "HTTP error " + response.status );
                }

                return response.json();
            } )
            .then( json => {
                this.currentLanguage = json.language;
                this.data = json.tokens;

                this.translate( document.getElementById( "container" ) );

                callbackSuccess();
            } )
            .catch( function () {
                callbackError();
            } );
    },

    get: function( pluginFunc, callbackSuccess, callbackError = OnErrorIgnored, callbackAbort = OnAbortIgnored, method = "GET" ) {
        if ( pluginFunc.length === 0 ) {
            return false;
        }

        var pluginURL = this.__buildApiUrl__( pluginFunc, true );

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.addEventListener( "abort", callbackAbort, false );
        xmlhttp.addEventListener( "error", callbackError, false );
        xmlhttp.addEventListener( "load", ( event ) => {
            if ( xmlhttp.readyState == 4 ) {
                if ( xmlhttp.status == 200 ) {
                    var json = {};

                    if ( ParseJSON( event.currentTarget.responseText, json ) ) {
                        callbackSuccess( json.message );
                    }
                    else {
                        callbackError( event );
                    }
                }
                else {
                    callbackError( event );
                }
            }
        }, false );
        xmlhttp.open( method, pluginURL, true );
        xmlhttp.send();

        return true;
    },

    post: function( pluginFunc, callbackSuccess, callbackError = OnErrorIgnored, callbackAbort = OnAbortIgnored, method = "POST" ) {
        if ( pluginFunc.length === 0 ) {
            return false;
        }

        var pluginURL = this.__buildApiUrl__( pluginFunc, true );

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.addEventListener( "abort", callbackAbort, false );
        xmlhttp.addEventListener( "error", callbackError, false );
        xmlhttp.addEventListener( "load", ( event ) => {
            if ( xmlhttp.readyState == 4 ) {
                if ( xmlhttp.status == 200 ) {
                    var json = {};

                    if ( ParseJSON( event.currentTarget.responseText, json ) ) {
                        if ( json.message.result && json.message.result == "success" ) {
                            callbackSuccess( json.message );
                        }
                        else {
                            callbackError( event );
                        }
                    }
                    else {
                        callbackError( event );
                    }
                }
                else {
                    callbackError( event );
                }
            }
        }, false );
        xmlhttp.open( method, pluginURL, true );
        xmlhttp.send();

        return true;
    },

    __buildApiUrl__: function( pluginFunc, addParameters, version ) {
        if ( !version ) {
            version = this.version;		// use most recent API version
        }

        // based on currently selected theme remove trading-URL
        var hostname = this.protocol + "://" + this.prefix + window.location.hostname + "/" + this.postfix;

        var paramStr = "";
        var result = pluginFunc;

        if ( addParameters !== false ) {
            for ( var i = 0; i < Parameters.size(); i++ ) {
                paramStr += "&";

                var name = Parameters.at(i).name;
                var value = Parameters.at(i).value;

                paramStr += name + "=" + value;
            }

            if ( paramStr !== "" ) {
                result += "?" + paramStr;
            }
        }

        return hostname + "/" + version + "/" + result;
    },

    __buildPluginUrl__: function( pluginFunc, addParameters ) {
        return this.__buildUrl__( "plugins/" + pluginFunc, addParameters );
    },

    __buildUrl__: function( funcName, addParameters ) {
        var paramStr = "";
        var result = funcName;

        if ( addParameters !== false ) {
            for ( var i = 0; i < Parameters.size(); i++ ) {
                paramStr += "&";

                var name = Parameters.at(i).name;
                var value = Parameters.at(i).value;

                paramStr += name + "=" + value;
            }

            if ( paramStr !== "" ) {
                result += "?" + paramStr;
            }
        }

        return window.location.href + result;
    }

};

