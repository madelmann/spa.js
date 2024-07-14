
var Templates = {

    clone: function( template ) {
        var tpl = document.querySelector( "#" + template );

        if ( !tpl ) {
            return new Template( `TEMPLATE '${template}' not found` );
        }

        return new Template( tpl.innerHTML );
    },

    cloneString: function( template ) {
        return new Template( template );
    }

};

class Template {
    constructor( template ) {
        this.template = template;
    }

    bind( placeholder, value ) {
        this.template = this.template.replaceAll( "{{" + placeholder + "}}", value );

        return this;
    }

    clone() {
        return new Template( this.template );
    }

    str() {
        return this.template;
    }
}

