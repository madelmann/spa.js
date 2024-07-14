
Translations = {

    collator: null,
    currentLanguage: "DE",
    data: null,
    dateFormatter: null,
    datetimeFormatter: null,
    internalNumberFormatter: null,
    numberFormatter: null,

    Constructor: function( defaultLanguage ) {
        if ( defaultLanguage ) {
            this.currentLanguage = defaultLanguage;
        }

        this.loadLanguage( this.currentLanguage );
    },

    Destructor: function() {
        // nothing to do here atm
    },

    date: function( date ) {
        return this.dateFormatter.format( Date.parse( date ) );
    },

    datetime: function( datetime ) {
        return this.datetimeFormatter.format( Date.parse( datetime ) );
    },

    fromNumber: function( number ) {
        return this.internalNumberFormatter.format( number );
    },

    loadLanguage: function( language ) {
        fetch( "lang/" + language + "/language.json" )
            .then( response => {
                if ( !response.ok ) {
                    throw new Error( "HTTP error " + response.status );
                }

                return response.json();
            } )
            .then( json => {
                this.currentLanguage = json.language;
                this.data = json.tokens;

                this.__switchLanguage__( language );

                this.translate( document.getElementById( "container" ) );
            } )
            .catch( function () {
                Translations.currentLanguage = language;
                Translations.data = [];
            } );
    },

    number: function( number ) {
        return this.numberFormatter.format( number );
    },

    sort: function( array ) {
        return array.sort( this.collator );
    },

    token: function( token ) {
        if ( !token || !this.data ) {
            return token;
        }

        for ( var idx = 0; idx < this.data.length; ++idx ) {
            if ( this.data[ idx ].key == token ) {
                return this.data[ idx ].value;
            }
        }

        //return this.currentLanguage + ":" + token;    // activate for debugging only
        return token;
    },

    translate: function( element ) {
        // translate values
        var list = element.getElementsByClassName( "translation" );

        for ( var idx = 0; idx < list.length; idx++ ) {
            // token-based translation
            list.item( idx ).innerText = Translations.token( list.item( idx ).getAttribute( "token" ) );
        }

        // translate placeholders
        var list = element.getElementsByClassName( "translation-placeholder" );

        for ( var idx = 0; idx < list.length; idx++ ) {
            // token-based translation
            list.item( idx ).placeholder = Translations.token( list.item( idx ).getAttribute( "token" ) );
        }
    },

    __supportsLocalization_: function() {
        // Get the user-agent string
        let userAgentString = navigator.userAgent;

        // Detect Chrome
        let chromeAgent = userAgentString.indexOf( "Chrome" ) > -1;

        // Detect Internet Explorer
        let IExplorerAgent = userAgentString.indexOf( "MSIE" ) > -1 || userAgentString.indexOf( "rv:" ) > -1;

        // Detect Firefox
        let firefoxAgent = userAgentString.indexOf( "Firefox" ) > -1;

        // Detect Safari
        let safariAgent = userAgentString.indexOf( "Safari" ) > -1;

        // Discard Safari since it also matches Chrome
        if ( chromeAgent && safariAgent )
            safariAgent = false;

        // Detect Opera
        let operaAgent = userAgentString.indexOf( "OP" ) > -1;

        // Discard Chrome since it also matches Opera
        if ( chromeAgent && operaAgent )
            chromeAgent = false;

        if ( chromeAgent ) {
            return false;
        }
        if ( firefoxAgent ) {
            return true;
        }
        if ( operaAgent ) {
            return false;
        }
        if ( safariAgent ) {
            return false;
        }

        return false;
    },

    __switchLanguage__: function( language ) {
        var supported = this.__supportsLocalization_();

        this.collator = new Intl.Collator( supported ? this.currentLanguage : "EN" );
        this.dateFormatter = new Intl.DateTimeFormat( this.currentLanguage, {
            day: "numeric",
            month: "numeric",
            year: "numeric"
        } );
        this.datetimeFormatter = new Intl.DateTimeFormat( this.currentLanguage, {
            dateStyle: "short",
            timeStyle: "short"
        } );
        this.internalNumberFormatter = new Intl.NumberFormat( supported ? this.currentLanguage : "EN" );
        this.numberFormatter = new Intl.NumberFormat( supported ? this.currentLanguage : "EN", {
            useGrouping: true
        } );
    }

};
