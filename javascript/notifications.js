
// convenice notification access
function notifyError( message )
{
    Notifications.notifyError( message, true );
}
function notifyErrorNT( message )
{
    Notifications.notifyError( message, false );
}

function notifyInfo( message )
{
    Notifications.notifyInfo( message, true );
}
function notifyInfoNT( message )
{
    Notifications.notifyInfo( message, false );
}

function notifySuccess( message )
{
    Notifications.notifySuccess( message, true );
}
function notifySuccessNT( message )
{
    Notifications.notifySuccess( message, false );
}

function notifyWarning( message )
{
    Notifications.notifyWarning( message, true );
}
function notifyWarningNT( message )
{
    Notifications.notifyWarning( message, false );
}


const ERROR_DURATION   = 25;
const INFO_DURATION    = 10;
const SUCCESS_DURATION = 5;
const WARNING_DURATION = 15;

Notifications = {

    elNotificationArea: null,
    messageId: 0,

    Constructor: function() {
        // nothing to do here atm
    },

    Destructor: function() {
        // nothing to do here atm
    },

    notify: function( type, message, duration, translate ) {
        if ( !duration ) {
            duration = INFO_DURATION;
        }

        let id = Math.random().toString( 36 ).substr( 2, 10 );
                
        let notification = document.createElement( "div" );
        notification.setAttribute( "id", id );
        notification.classList.add( "notification", type );
        if ( translate == false ) {
            notification.innerText = message;
        }
        else {
            notification.innerText = Translations.token( message );
        }

        if ( !this.elNotificationArea ) {
            this.elNotificationArea = document.getElementById( "notification-area" );
        }

        this.elNotificationArea.appendChild( notification );

        setTimeout( () => {
            var notifications = this.elNotificationArea.getElementsByClassName( "notification" );

            for( let i = 0; i < notifications.length; i++ ) {
                if( notifications[ i ].getAttribute( "id" ) == id ) {
                    notifications[ i ].remove();
                    break;
                }
            }
        }, duration * 1000 );
    },

    notifyError: function( message, translate ) {
        this.notify( "error", message, ERROR_DURATION, translate );
    },

    notifyInfo: function( message, translate ) {
        this.notify( "info", message, INFO_DURATION, translate );
    },

    notifySuccess: function( message, translate ) {
        this.notify( "success", message, SUCCESS_DURATION, translate );
    },

    notifyWarning: function( message, translate ) {
        this.notify( "warning", message, WARNING_DURATION, translate );
    }

};

