
// Define the new element
customElements.define(
    "popup-info",
    class extends HTMLElement {
        static get observedAttributes() {
            return [ "token" ];
        }

        constructor() {
            // Always call super first in constructor
            super();
        }

        adoptedCallback() {
            // nothing to do here
        }

        attributeChangedCallback( attrName, oldVal, newVal ) {
            // nothing to do here
        }

        connectedCallback() {
            this.__do_stuff__();
        }

        disconnectedCallback() {
            // nothing to do here
        }

        __do_stuff__() {
            // Create a shadow root
            const shadow = this.attachShadow( { mode: "open" } );

            // Create spans
            const wrapper = document.createElement( "span" );
            wrapper.setAttribute( "class", "wrapper" );

            const icon = document.createElement( "span" );
            icon.setAttribute( "class", "icon" );
            icon.setAttribute( "tabindex", 0 );

            const info = document.createElement( "span" );
            info.setAttribute( "class", "info" );

            const token = this.getAttribute( "token" );
            if ( token ) {
                info.textContent = Translations.token( token );
            }
            else {
                // Take attribute content and put it inside the info span
                const text = this.getAttribute( "data-text" );
                info.textContent = text;
            }

            // Insert icon
            let imgUrl;
            if( this.hasAttribute( "img" ) ) {
                imgUrl = this.getAttribute( "img" );
            }
            else {
                imgUrl = "resources/icons/info-alt.png";
            }

            const img = document.createElement( "img" );
            img.src = imgUrl;
            icon.appendChild( img );

            // Create some CSS to apply to the shadow dom
            const style = document.createElement( "style" );

            style.textContent = `
                img {
                    width: 1.2rem;
                }
                .info {
                    font-size: 0.8rem;
                    width: 200px;
                    display: inline-block;
                    border: 1px solid black;
                    padding: 10px;
                    background: white;
                    border-radius: 10px;
                    opacity: 0;
                    transition: 0.6s all;
                    position: absolute;
                    bottom: 20px;
                    left: 10px;
                    z-index: 3;
                }
                .icon:hover + .info, .icon:focus + .info {
                    opacity: 1;
                }
                .wrapper {
                    position: relative;
                }
            `;

            // Attach the created elements to the shadow dom
            shadow.appendChild( style );
            shadow.appendChild( wrapper );
            wrapper.appendChild( icon );
            wrapper.appendChild( info );
        }
      } );

/*
 *  RESTRICT-ACCESS: only displays its contents if the user
 *  has the correct profile attribute
 */
customElements.define(
    "restrict-access",
    class extends HTMLElement {
        static get observedAttributes() {
            return [ "profile" ];
        }

        constructor() {
            // Always call super first in constructor
            super();
        }

        adoptedCallback() {
            // nothing to do here
        }

        attributeChangedCallback( attrName, oldVal, newVal ) {
            this.restrict();
        }

        connectedCallback() {
            this.restrict();
        }

        disconnectedCallback() {
            // nothing to do here
        }

        restrict() {
            if ( this.hasAttribute( "profile" ) ) {
                var profile  = this.getAttribute( "profile" );
                var profiles = profile.split( "," );

                if ( !profile || Cache.settings && profiles.includes( Cache.settings.userProfile ) ) {
                    // access granted, don't delete elements content
                    return;
                }

                this.innerHTML = "";
            }
        }
    } );

/*
 *  DIV-RESTRICTED: only displays its contents if the user either
 *  - is logged in (requires "login" attribute) 
 *  or
 *  - has admin rights (requires "elevated" attribute)
 */
customElements.define(
    "div-restricted",
    class extends HTMLDivElement {
        static get observedAttributes() {
            return [ "access" /*, "elevated", "login"*/ ];
        }

        constructor() {
            // Always call super first in constructor
            super();
        }

        adoptedCallback() {
            // nothing to do here
        }

        attributeChangedCallback( attrName, oldVal, newVal ) {
            this.restrict();
        }

        connectedCallback() {
            this.restrict();
        }

        disconnectedCallback() {
            // nothing to do here
        }

        restrict() {
            // write element functionality in here

            if ( this.hasAttribute( "access" ) ) {
                if ( Cache.settings && this.getAttribute( "access" ).split( "," ).includes( Cache.settings.userProfile ) ) {
                    // access granted, don't delete elements content
                    return;
                }
            }
            /*
            else if ( this.hasAttribute( "login" ) && Account.IsLoggedIn() ) {
                // access granted, don't delete elements content
                return;
            }
            */

            this.innerHTML = "";
        }
    }, { extends: 'div' } );


/*
 *  LI-RESTRICTED: only displays its contents if the user either
 *  - is logged in (requires "login" attribute) 
 *  or
 *  - has admin rights (requires "elevated" attribute)
 */
customElements.define(
    "li-restricted",
    class extends HTMLLIElement {
        static get observedAttributes() {
        return [ "access" /*, "elevated", "login"*/ ];
        }

        constructor() {
            // Always call super first in constructor
            super();
        }

        adoptedCallback() {
            // nothing to do here
        }

        attributeChangedCallback( attrName, oldVal, newVal ) {
            this.restrict();
        }

        connectedCallback() {
            this.restrict();
        }

        disconnectedCallback() {
            // nothing to do here
        }

        restrict() {
            // write element functionality in here

            if ( this.hasAttribute( "access" ) ) {
                if ( Cache.settings && this.getAttribute( "access" ).split( "," ).includes( Cache.settings.userProfile ) ) {
                    // access granted, don't delete elements content
                    return;
                }
            }
            /*
            else if ( this.hasAttribute( "login" ) && Account.IsLoggedIn() ) {
                // access granted, don't delete elements content
                return;
            }
            */

            this.innerHTML = "";
        }
    } , { extends: 'li' } );
