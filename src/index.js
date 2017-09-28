/**
 * @file: WebP-Canvas
 * @author: lijialiang
 * @export: umd
 * @export name: WebPCanvas
 * @export file: webp-canvas
 */

'use strict';

class WebPCanvas {
    /*
     * the worker static attr.
     */
    static worker = void 0;

    /*
     * Set the configuration
     */
    static config ( option ) {
        if ( typeof option === 'string' ) {
            WebPCanvas.worker = option;
        }
        else {
            WebPCanvas.worker = option.worker;
        }
    }

    /*
     * the canvas element
     */
    canvas = void 0;

    /*
     * the canvas element context
     */
    context = void 0;

    /*
     * webp raw data
     */
    webp = void 0;

    /*
     * instance worker
     */
    worker = void 0;

    /*
     * player timer
     */
    timer = void 0;

    /*
     * canvas create imageData
     */
    imagedata = void 0;

    /*
     * the width of webp file
     */
    width = void 0;

    /*
     * the height of webp file
     */
    height = void 0;

    /*
     * the number of frames in the player
     */
    frame = 0;

    /*
     * the number of loop in the player
     */
    loop = 0;

    /*
     * player state
     */
    state = void 0;

    /*
     * prepare the player callback
     */
    mounted = () => { };

    /*
     * according to the option to instantiate
     */
    constructor ( option ) {

        if ( typeof option.canvas === 'string' ) {
            this.canvas = document.body.querySelector( option.canvas );
        }
        else {
            this.canvas = option.canvas;
        }

        this.context = this.canvas.getContext('2d');

        this.webp = option.webp;
        this.mounted = option.mounted;

        this.initWorker();

        this.initParse();
    }

    /*
     * init the worker
     */
    initWorker ( ) {
        if ( WebPCanvas.worker ) {
            try {
                this.worker = new Worker( WebPCanvas.worker );
            } catch ( e ) {
                throw `[WebP Canvas]: ${ e }`;
            }
        }
    }

    /*
     * download and parse webp files，through the Worker
     */
    initParse ( ) {
        this.worker.postMessage( this.webp );
        this.worker.onmessage = ({ data }) => {
            this.webp = data;

            const { header, frames } = this.webp;
            this.width = header[ 'canvas_width' ];
            this.height = header[ 'canvas_height' ];
            const loop = header[ 'loop_count' ];

            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.imagedata = this.context.createImageData( this.width, this.height );

            this.state = 'ready';

            this.mounted();
        }
    }

    /*
     * play the webp animation
     */
    play ( ) {
        if ( !this.state ) {
            console.error(`[WebP Canvas]: the webp is not ready.`);
            return void 0;
        }

        if ( this.state === 'play' ) {
            return void 0;
        }

        this.state = 'play';

       this.draw();
    }

    /*
     * reset the imageData of canvas
     */
    _imageData ( ) {
        const { frames } = this.webp;

        const rgba = frames[ this.frame ].rgba;

        for ( let i = 0; i < this.width * this.height * 4; i += 4 ) {
            this.imagedata.data[ i + 3 ] = rgba[ i + 3 ];
            this.imagedata.data[ i ] = rgba[ i ];
            this.imagedata.data[ i + 1 ] = rgba[ i + 1 ];
            this.imagedata.data[ i + 2 ] = rgba[ i + 2 ];
        }

        this.context.putImageData(this.imagedata, 0, 0);
    }

    /*
     * draw the single frame
     */
    draw ( ) {
        const { header: { loop_count: loop }, frames } = this.webp;

        if ( frames.length === 1 ) {
            this._imageData();
            return void 0;
        }

        if ( this.frame < frames.length - 1 ) {

            if ( this.timer ) {
                clearTimeout( this.timer );
            }

            this.timer = setTimeout(( ) => {
                this._imageData();

                this.draw();

                ++this.frame;
                ++this.loop;

            }, this.frame === 0 ? 0 : frames[ this.frame ][ 'duration' ] );
        }
        else {
            // infinite loop
            if ( loop === 0 ) {
                this.frame = 0;
                this.draw();
            }
            else {
                if ( this.loop <= loop ) {
                    this.frame = 0;
                    this.draw();
                }
            }
        }
    }

    /*
     * stop playing the animation
     */
    stop ( ) {
        if ( this.state === 'stop' ) {
            return void 0;
        }

        this.state = 'stop';

        this.frame = 0;
        this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
        clearTimeout( this.timer );
    }

    /*
     * pause playing the animation
     */
    pause ( ) {
        if ( this.state === 'pause' ) {
            return void 0;
        }

        this.state = 'pause';

        clearTimeout( this.timer );
    }

    /*
     * load other webp file
     */
    load ( data ) {
        this.state = void 0;

        this.stop();

        this.worker.postMessage( { type: 'load', data } );
    }
}

module.exports = WebPCanvas;
