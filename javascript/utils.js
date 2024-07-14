
function $( element )
{
    return document.querySelector( element );
}

function $all( element )
{
    return document.querySelectorAll( element );
}

function GetPluginName()
{
    if ( mPlugin && mPlugin.pluginName ) {
        return mPlugin.pluginName;
    }

    return "";
}

function GetURLParameter( parameterName )
{
    var result = null;
    var tmp = [];

    var items = window.location.search.substr( 1 ).split( "&" );

    for ( var index = 0; index < items.length; index++ ) {
        tmp = items[ index ].split( "=" );

        if ( tmp[ 0 ] === parameterName ) {
            result = decodeURIComponent( tmp[ 1 ] );
        }
    }

    return result;
}

function IsFormValid( element )
{
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = $all( ".needs-validation" );
    if ( element ) {
        forms = $all( "form#" + element + ".needs-validation" );
    }

    if ( !forms ) {
        return true;
    }

    var elementsValid = true;
    forms.forEach( element => {
        if ( !element.checkValidity() ) {
            elementsValid = false;
            return false;
        }
    } );

    if ( !elementsValid ) {
        notifyError( "INVALID_INPUT" );
    }

    return elementsValid;
}

function IsPlugin( pluginName )
{
    return GetPluginName() == pluginName;
}

function ParseJSON( input, output )
{
    try {
        output.message = JSON.parse( input );

        return true;
    }
    catch ( e ) {
        output.message = e.message;
    }

    return false;
}

function Redirect( page )
{
    var newPage = window.location.protocol + "//" + window.location.hostname + "/" + ( page ? page : "" );
    if ( window.location == newPage ) {
        // prevent redirects to ourself
        return;
    }

    window.location.assign( newPage );
}


///////////////////////////////////////////////////////////////////////////////
// Pagination

function Pagination( pagination )
{
    var pages = $all( ".pagination" );

    if ( !pagination || pagination.numPages < 2 ) {
        // pagination not needed or invalid
        for ( const elem of pages ) {
            elem.innerHTML = "";
        }

        return;
    }

    var tplPageCurrent     = Templates.clone( "template-pagination-large-page-current" );
    var tplPageNext        = Templates.clone( "template-pagination-large-page-next" );
    var tplPagePrevious    = Templates.clone( "template-pagination-large-page-previous" );
    var tplPage            = Templates.clone( "template-pagination-large-page" );
    var tplPaginationSmall = Templates.clone( "template-pagination-small" );
    var tplPaginationLarge = Templates.clone( "template-pagination-large-all-pages" );

    var modulo = Math.trunc( pagination.numPages / 3 );
    var pagesHTML = "";
    for ( var page = 1; page < pagination.numPages + 1; page++ ) {
        if (
            ( page != 1 && page != pagination.currentPage && page != pagination.numPages + 1 )	// first and last page will always be visible
            && ( page < pagination.currentPage - 1 || page > pagination.currentPage + 1 )		// 2 pages left and right of current page will always be visible
            && ( page % modulo != 0 )															// every nth page will always be visible
        ) {
            continue;
        }

        if ( page == pagination.currentPage ) {
            pagesHTML += tplPageCurrent.clone()
                        .bind( "PAGE", page )
                        .str();

            continue;
        }

        pagesHTML += tplPage.clone()
                    .bind( "PAGE", page )
                    .str();
    }

    tplPaginationLarge.bind( "PAGES", tplPagePrevious.str() + pagesHTML + tplPageNext.str() );
    tplPaginationSmall.bind( "CURRENT_PAGE", pagination.currentPage + " / " + pagination.numPages );

    for ( var idx = 0; idx < pages.length; idx++ ) {
        pages[ idx ].innerHTML = tplPaginationSmall.str() + tplPaginationLarge.str();

        Translations.translate( pages[ idx ] );
    }
}

function PaginationLarge( pagination )
{
    var pages = $all( ".pagination" );

    if ( !pagination || pagination.numPages < 2 ) {
        // pagination not needed or invalid
        for ( const elem of pages ) {
            elem.innerHTML = "";
        }

        return;
    }

    var tplPageCurrent  = Templates.clone( "template-pagination-large-page-current" );
    var tplPageNext     = Templates.clone( "template-pagination-large-page-next" );
    var tplPagePrevious = Templates.clone( "template-pagination-large-page-previous" );
    var tplPage         = Templates.clone( "template-pagination-large-page" );
    var tplPagination   = Templates.clone( "template-pagination-large-all-pages" );

    var modulo = Math.trunc( pagination.numPages / 4 );
    var pagesHTML = "";
    for ( var page = 1; page < pagination.numPages + 1; page++ ) {
        if (
            ( page != 1 && page != pagination.currentPage && page != pagination.numPages + 1 )	// first and last page will always be visible
            && ( page < pagination.currentPage - 1 || page > pagination.currentPage + 1 )		// 2 pages left and right of current page will always be visible
            && ( page % modulo != 0 )															// every nth page will always be visible
        ) {
            continue;
        }

        if ( page == pagination.currentPage ) {
            pagesHTML += tplPageCurrent.clone()
                        .bind( "PAGE", page )
                        .str();

            continue;
        }

        pagesHTML += tplPage.clone()
                    .bind( "PAGE", page )
                    .str();
    }

    tplPagination.bind( "PAGES", tplPagePrevious.str() + pagesHTML + tplPageNext.str() );

    for ( var idx = 0; idx < pages.length; idx++ ) {
        pages[ idx ].innerHTML = tplPagination.str();

        Translations.translate( pages[ idx ] );
    }
}

function PaginationSmall( pagination )
{
    var pages = $all( ".pagination" );

    if ( !pagination || pagination.numPages < 2 ) {
        // pagination not needed or invalid
        for ( const elem of pages ) {
            elem.innerHTML = "";
        }

        return;
    }

    var tplPaginationSmall = Templates.clone( "template-pagination-small" );

    tplPaginationSmall.bind( "CURRENT_PAGE", pagination.currentPage );
    tplPaginationSmall.bind( "NUM_PAGES", pagination.numPages );

    for ( var idx = 0; idx < pages.length; idx++ ) {
        pages[ idx ].innerHTML = tplPaginationSmall.str();

        Translations.translate( pages[ idx ] );
    }
}

// Pagination
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Stylesheet handling

function LoadStyleSheet( DOMelement, url )
{
    if ( !DOMelement ) {
        return;
    }

    DOMelement.disabled = false;
    DOMelement.setAttribute( "rel", "stylesheet" );
    DOMelement.setAttribute( "type", "text/css" );
    DOMelement.setAttribute( "href", url + "?v=" + APP_VERSION );
}

function LoadTheme( themeCss )
{
    UnloadStyleSheet( $( "#theme" ) );
    LoadStyleSheet( $( "#theme" ), themeCss );
}

function UnloadStyleSheet( DOMelement )
{
    if ( !DOMelement ) {
        return;
    }

    DOMelement.disabled = true;
    DOMelement.href = "data:text/css,"; // empty stylesheet to be sure
}

// Stylesheet handling
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Little helpers

function utf8_to_b64( str ) {
    return btoa( unescape( encodeURIComponent( str ) ) );
}

function b64_to_utf8( str ) {
    return decodeURIComponent( escape( atob( str ) ) );
}

function dateTime() {
    var today = new Date();
    var date = pad( today.getFullYear() ) + '-' + pad( today.getMonth() + 1 ) + '-' + pad( today.getDate() );
    var time = pad( today.getHours() ) + ":" + pad( today.getMinutes() ) + ":" + pad( today.getSeconds() );

    return date + ' ' + time;
}

function pad( n ) {
    return n < 10 ? '0' + n : n;
}

function sleep( delay ) {
    var start = new Date().getTime();

    while ( new Date().getTime() < start + delay ) ;
}

function toFixed( num, fixed ) {
    fixed = fixed || 0;
    fixed = Math.pow( 10, fixed );

    return Math.floor( num * fixed ) / fixed;

    //return ( Math.floor( num * 100 ) / 100 ).toFixed( fixed );
}

// Little helpers
///////////////////////////////////////////////////////////////////////////////
