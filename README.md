# webp-canvas

Based on [libwebpjs](http://libwebpjs.hohenlimburg.org/v0.6.0/) to parse WebP files, and display them on Canvas elements for compatibility with browsers that do not support WebP files.

Some optimization, through Worker to download and parse WebP files to prevent the impact of page thread.

[中文查看](https://github.com/lilijialiang/webp-canvas/blob/master/README.zh-CN.md)

## Simple Usage

```html
<!DOCTYPE html>
<html>
<head>
    <title> WebP Canvas Example </title>
</head>
<body>

    <canvas id="canvas"></canvas>

    <script src="../dist/webp-canvas.min.js"></script>

    <script>
        WebPCanvas.config( '../dist/webp-canvas.worker.min.js' );

        var webpCanvas = new WebPCanvas({
            canvas: '#canvas',
            webp: '1.webp',
            mounted: function () {
                webpCanvas.play();
            },
        });
    </script>

</body>
</html>
```

Because of cross-domain issues, need to put the Worker file, source files and WebP files in the same primary domain.

**[→ Example](https://legox.org/assets/webp-canvas/)**

