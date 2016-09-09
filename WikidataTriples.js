class WikidataTriples extends SimpleWeb {
    constructor ($raw) {
        super($raw);
    }

    // @Override
    constructHTML () {
        var makeTitle = (b, baseUrl) => {
            var b = b.trim();
            return `<a href="${baseUrl}/${b}" target="_blank"><h1 class="${this.css.title}">${b.trim()}</h1></a>`;
        };

        var makeAnchorLink = (b, baseUrl, q) => {
            return `<a href="${baseUrl}${q}" target="_blank">${b}</a>`;
        }

        var rows = this.rows;

        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var spo = row.split('\t');

            if (row.match(/^#!/)) {
                continue;
            }else if (row.match(/^#/)) {
                this.htmls.push(makeTitle(row.split('#')[1], 'http://www.wikidata.org/wiki/Special:ItemByTitle/enwiki'));
                continue;
            }else if (spo.length === 3) {
                var entityBaseUrl = 'https://www.wikidata.org/wiki/';
                var propBaseUrl = 'https://www.wikidata.org/wiki/Property:';
                // triple
                var s = spo[0];
                var p = spo[1];
                var o = spo[2];

                var oStr = o;
                if (oStr[0] !== '"') {
                    oStr = makeAnchorLink(o, entityBaseUrl, o);
                }
                var triple = `<li>${makeAnchorLink(s, entityBaseUrl, s)}　　${makeAnchorLink(p, propBaseUrl, p)}　　${oStr}</li>`;

                this.htmls.push(triple);
                continue;
            }else {
                continue;
            }

            this.htmls.push(row);
        }
    }
}
