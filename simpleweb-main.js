$(function () {
    var $pre = $('pre');
    var detective = $pre[0].innerHTML.split('\n')[0];
    var mode = (detective.split('#!')[1] || '').trim();

    var sw;
    if (mode === 'wikidata-triples') {
        sw = new WikidataTriples($pre);
    }else {
        sw = new SimpleWeb($pre);
    }
    if (sw.parse()) {
        sw.constructHTML();
        sw.render($('body'));
    }
    console.info("SimpleWeb!");
});
