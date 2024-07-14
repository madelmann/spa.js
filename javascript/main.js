"use strict";

// Initial member declarations
var API;
var Globals = {};
var History;
var Navigation;
var Notifications;
var Parameters;
var Settings;
var Templates;
var Translations;

// const RootComponent = {
//     data() {
//         return {
//             languages: [],
//             plugin: null,
//             renderComponent: true,
//             settings: null,
//             stats: {
//                 pageLoadedAt: null
//             },
//             template: null
//         }
//     }
// };

const RootComponent = {
    data() {
        return cachedEntities;
    }
};

const app = Vue.createApp( RootComponent );


function __init__()
{
    document.addEventListener( "DOMContentLoaded", function() {
        let e = document.getElementsByTagName( "include" );
        for ( var t = 0; t < e.length; t++ ) {
            let a = e[ t ];

            n( e[ t ].attributes.src.value, function( e ) {
                a.insertAdjacentHTML( "afterend", e );
                a.remove();
            } );
        }

        function n( e, t ) {
            fetch( e )
                .then( e => e.text() )
                .then( e => t( e ) );
        }
    } );
}

function __main__()
{
    __init__();

    Globals.Admin = false;
    Globals.Debug = false;
    Globals.vm = app.mount( "#container" );
    Globals.vm.stats.pageLoadedAt = dateTime();

    // determine storage capabilities
    if ( typeof( Storage ) !== "undefined" ) {
        // Code for localStorage/sessionStorage.
        Globals.StorageAvailable = true;
    }
    else {
        // Sorry! No Web Storage support..
        Globals.StorageAvailable = false;
    }

    Cache.Retrieve();

    // Conversions.Constructor();
    History.Constructor();
    Notifications.Constructor();
    Refresh.Constructor();
    Settings.Constructor();
    Translations.Constructor();
}
