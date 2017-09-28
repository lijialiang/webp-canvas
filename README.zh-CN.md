# webp-canvas

基于 [libwebpjs](http://libwebpjs.hohenlimburg.org/v0.6.0/) 分析 WebP 文件，并在 Canvas 元素上展示它们，目的在于兼容那些不支持 WebP 文件的浏览器。

一些优化，通过 Worker 进行下载、解析 WebP 文件，防止影响页面主线程。

## 简单使用

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

因为跨域的问题，需要把 Worker 文件、源文件 和 WebP 文件 放置在同一主域。

**[→ 例子](https://legox.org/assets/webp-canvas/)**

