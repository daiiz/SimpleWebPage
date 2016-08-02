var sw;
$(function () {
    sw = new SimpleWeb($('pre'));
    if (sw.parse()) {
        sw.constructHTML();
        sw.render($('body'));
    }
    console.info("SimpleWeb");
    console.info(sw);
});
