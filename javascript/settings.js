
Settings = {

    Plugins: [],
    UsePluginCache: true,

    Constructor: function() {
        this.retrieve();
    },

    get: function( pluginName, attribute, defaultValue = "" ) {
        for ( var idx = 0; idx < this.Plugins.length; ++idx ) {
            if ( this.Plugins[ idx ].name == pluginName ) {
                if ( this.Plugins[ idx ].persistent[ attribute ] !== undefined ) {
                    return this.Plugins[ idx ].persistent[ attribute ];
                }
                else if ( this.Plugins[ idx ].data[ attribute ] !== undefined ) {
                    return this.Plugins[ idx ].data[ attribute ];
                }

                return defaultValue;
            }
        }

        return defaultValue;
    },

    retrieve: function( pluginName ) {
        let settings = JSON.parse( localStorage.getItem( "settings" ) );
        if ( !settings ) {
            return;
        }

        this.Plugins = [];

        try {
            for ( var idx = 0; idx < settings.length; ++idx ) {
                var plugin = JSON.parse( settings[ idx ] );

                plugin.data       = [];
                plugin.persistent = JSON.parse( plugin.persistent );

                this.Plugins.push( plugin );
            }
        }
        catch ( e ) {
            console.log( e );
        }
    },

    set: function( pluginName, attribute, value ) {
        for ( var idx = 0; idx < this.Plugins.length; ++idx ) {
            if ( this.Plugins[ idx ].name == pluginName ) {
                this.Plugins[ idx ].data[ attribute ] = value;
                return;
            }
        }

        var plugin = { name: pluginName, data: [], persistent: [] };
        plugin.data[ attribute ] = value;

        this.Plugins.push( plugin );
    },

    setPersistent: function( pluginName, attribute, value ) {
        for ( var idx = 0; idx < this.Plugins.length; ++idx ) {
            if ( this.Plugins[ idx ].name == pluginName ) {
                this.Plugins[ idx ].persistent[ attribute ] = value;
                return;
            }
        }

        var plugin = { name: pluginName, data: [], persistent: [] };
        plugin.persistent[ attribute ] = value;

        this.Plugins.push( plugin );
    },

    store: function() {
        var plugins = [];

        for ( var idx = 0; idx < this.Plugins.length; ++idx ) {
            var plugin = this.Plugins[ idx ];

            plugins.push( JSON.stringify( { name: plugin.name, persistent: JSON.stringify( Object.assign( {}, plugin.persistent ) ) } ) );
        }

        const settings = JSON.stringify( plugins );

        localStorage.setItem( "settings", settings );
    }
};

