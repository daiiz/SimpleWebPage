$(function () {
    var sw = new SimpleWeb($('pre'));
    sw.insertCSS();
    if (sw.parse()) {
        sw.constructHTML();
        sw.render($('body'));
    }
    console.info("SimpleWeb");
});
