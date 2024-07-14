#!/usr/local/bin/slang

// library imports
import FileReader.Scanner;
import libJsonBuilder.StructuredBuilder;
import libParam;
import System.Collections.ICollection;
import System.Collections.Iterator;
import System.Collections.Vector;

// project imports


public void Main( int argc, string args ) {
        try {
                var params = new ParameterHandler( argc, args );
                if ( !params.contains( "language" ) ) {
                        print( "missing language!" );
                        exit( -1 );
                }

                var language = params[ "language" ].Value;

                var mapper = new TemplateMapper( language );
                var output = new System.IO.File( language + "/language.json", System.IO.File.AccessMode.WriteOnly );

                String section;

                Json.AddElement( "language", language );
                Json.BeginArray( "tokens" );
                // Json.BeginArray( "sections" );

                foreach ( KeyValuePair template : mapper ) {
                        var key   = strtrim( template.Key );      // trim leading and trailing spaces
                        var value = strtrim( template.Value );    // trim leading and trailing spaces

                        if ( key == "[Section" ) {
                                // if ( section ) {
                                //         // close previous section
                                //         Json.EndArray();
                                //         Json.EndObject();
                                // }

                                section = new String( value );
                                section = section.SubString( 0, strlen( value ) - 1 );

                                // print( "section: " + cast<string>( section ) );

                                // // open new section
                                // Json.BeginObject();
                                // Json.AddElement( "section", cast<string>( section ) );
                                // Json.BeginArray( "tokens" );

                                continue;
                        }

                        Json.BeginObject();
                        Json.AddElement( "key", key );
                        Json.AddElement( "value", value );
                        Json.EndObject();
                }

                // if ( section ) {
                //         // close previous section
                //         Json.EndArray();
                //         Json.EndObject();
                // }

                Json.EndArray();
                output.write( Json.GetString() );
                output.close();
        }
        catch ( string e ) {
                print( "Exception: " + e );
        }
        catch ( IException e ) {
                print( "Exception: " + e.what() );
        }
}


private object KeyValuePair {
        public string Key;
        public string Value;

        public void Constructor( string key, string value ) {
                Key = key;
                Value = value;
        }
}

private object TemplateMapper implements ICollection {
        public void Constructor( string language ) {
                mTemplates = new Vector<KeyValuePair>();

                load( language );
        }

        public KeyValuePair at( int index ) const throws {
                return mTemplates.at( index );
        }

        public bool empty() const {
                return mTemplates.empty();
        }

        public Iterator<KeyValuePair> getIterator() const {
                return mTemplates.getIterator();
        }

        public int size() const {
                return mTemplates.size();
        }

        private void insertPair( string line ) modify throws {
/*
                var it = new String( line ).SplitBy( ":" );

                mTemplates.push_back( new KeyValuePair( it.next(), it.next() ) );
*/

                var pos = strfind( line, ":" );
                if ( pos != -1 ) {
                        mTemplates.push_back( new KeyValuePair( substr( line, 0, pos ), substr( line, pos + 2 ) ) );
                }
        }

        private void load( string language ) modify {
                var charIt = new Scanner( language + "/template.txt" ).getIterator();

                string c;
                bool comment;
                string text;
                while ( charIt.hasNext() ) {
                        c = charIt.next();

                        if ( text == "#" ) {
                                comment = true;
                        }
                        if ( c == LINEBREAK ) {
                                if ( !comment && text ) {       // empty lines will be ignored
                                        insertPair( text );
                                }

                                comment = false;
                                text = "";
                                continue;
                        }

                        text += c;
                }
        }

        private Vector<KeyValuePair> mTemplates;
}

