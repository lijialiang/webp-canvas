self.window = self;

importScripts('./lib/libwebp-0.6.0.min.js');
importScripts('./lib/demux.js');

onmessage = function ( { data } ) {
	switch ( data.type ) {
		case 'load': {
			parse( convertBinaryToArray( data.data ) );
			break;
		}
		case undefined: {
			download( data );
			break;
		}
	}
}

/*
 * convert binary data to array
 */
const convertBinaryToArray = function ( binary ) {
	let array = new Array();
	const num = binary.length;
	for ( let i = 0; i < num; ++i ) {
		array.push ( binary.charCodeAt( i ) );
	}
	return array;
}

/*
 * download webp file
 */
const download = function ( data ) {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', data, true);

	xhr.onreadystatechange = function () {
		if ( this.readyState == 4 && this.response != null ) {
            parse( Array.from( new Uint8Array( this.response ) ) );
		}
    };

    xhr.responseType = 'arraybuffer';

	xhr.send();
}

/*
 * parse webp file, through libwebp & demux
 */
const parse = function ( webp ) {

    const webpdecoder = new window.WebPDecoder();

	const _webp = WebPRiffParser( webp, 0 );

	const frames = _webp.frames;

    for ( let f = 0; f < frames.length; f++ ) {
		let height = [0];
		let width = [0];
		let frame = frames[f];

		_webp.frames[ f ].rgba = webpdecoder.WebPDecodeRGBA( webp, frame['src_off'], frame['src_size'], width, height );
	}

	postMessage( _webp );
}
