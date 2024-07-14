
Parameters = {

	mParams: [],
	mPermanent: [],

add: function(name, value) {
	this.mParams.push({ "name": name, "value": value });
},

addOrSet: function(name, value) {
	var idx = 0;

	for ( idx = 0; idx < this.mParams.length; ++idx ) {
		if ( this.mParams[idx].name == name ) {
			this.mParams[idx].value = value;
			return;
		}
	}
	for ( idx = 0; idx < this.mPermanent.length; ++idx ) {
		if ( this.mPermanent[idx].name == name ) {
			this.mPermanent[idx].value = value;
			return;
		}
	}

	this.mParams.push({ "name": name, "value": value });
},

addOrSetPermanent: function(name, value) {
	var idx = 0;

	for ( idx = 0; idx < this.mPermanent.length; ++idx ) {
		if ( this.mPermanent[idx].name == name ) {
			this.mPermanent[idx].value = value;
			return;
		}
	}

	this.mPermanent.push({ "name": name, "value": value });
},

addPermanent: function(name, value) {
	this.mPermanent.push({ "name": name, "value": value });
},

at: function(idx) {
	if ( idx >= this.size() ) {
		OnError("index out of bounds!");
		return null;
	}

	if ( idx < this.mParams.length ) {
		return this.mParams[idx];
	}

	return this.mPermanent[idx - this.mParams.length];
},

clear: function() {
	this.mParams = [];
},

get: function(param) {
	var idx = 0;

	for ( idx = 0; idx < this.mParams.length; ++idx ) {
		if ( this.mParams[idx].name == param ) {
			return this.mParams[idx].value;
		}
	}
	for ( idx = 0; idx < this.mPermanent.length; ++idx ) {
		if ( this.mPermanent[idx].name == param ) {
			return this.mPermanent[idx].value;
		}
	}

	return null;
},

isSet: function(param) {
	var idx = 0;

	for ( idx = 0; idx < this.mParams.length; ++idx ) {
		if ( this.mParams[idx].name == param ) {
			return true;
		}
	}
	for ( idx = 0; idx < this.mPermanent.length; ++idx ) {
		if ( this.mPermanent[idx].name == param ) {
			return true;
		}
	}

	return false;
},

remove: function(param) {
	for ( var idx = 0; idx < this.mParams.length; ++idx ) {
		if ( this.mParams[idx].name == param ) {
			this.mParams.splice(idx, 1);

			return true;
		}
	}

	return false;
},

removePermanent: function(param) {
	for ( var idx = 0; idx < this.mPermanent.length; ++idx ) {
		if ( this.mPermanent[idx].name == param ) {
			this.mPermanent.splice(idx, 1);

			return true;
		}
	}

	return false;
},

size: function() {
	return this.mParams.length + this.mPermanent.length;
},

toString: function() {
	return JSON.stringify(this.mParams) + ", " + JSON.stringify(this.mPermanent);
},

values: function() {
	return this.mParams + this.mPermanent;
}

};

