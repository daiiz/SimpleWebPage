class SimpleWeb {
    constructor ($raw) {
        this.$raw = $raw;
        this.rawText = $raw[0].innerText;
        this.rows = [];

        this.htmls = [];
        this.notes = {};  // 脚注を溜める

        this.$stage = [];

        // CSSクラス
        this.css = {
            "title": "simpleweb-title",
            "txt"  : "simpleweb-txt",
            "item" : "simpleweb-item"
        }
    }

    /**
     * rowsを構築する
     */
    parse () {
        this.rows = this.rawText.split('\n');
        var newRows = [];

        var isNote = (a) => {
            var res = {};
            if (a === undefined) return false;
            if (a[0] !== '*') return false;
            if (a.indexOf(':') === -1) return false;
            res.num = a.split(':')[0].replace('*', '');
            var url = "";
            for (var i = 1; i < a.split(':').length; i++) url += a.split(':')[i];
            res.url = url.trim();
            return res;
        };

        // 脚注を最初に回収する
        for (var i = 0; i < this.rows.length; i++) {
            // 脚注であるかどうか判定
            var note = isNote(this.rows[i]);
            if (note) {
                this.notes["note_" + note.num] = note.url;
                continue;
            }else {
                newRows.push(this.rows[i]);
            }
        }

        this.rows = newRows;
        return true;
    }

    /**
     * rowsをもとにhtmlsを構築する
     */
    constructHTML () {
        var self = this;

        if (this.htmls.length !== 0) {
            this.htmls = [];
            this.notes = {};
        }

        var isTitle = (a, b, c) => {
            if (a === undefined || b === undefined || c === undefined) return false;
            if (a !== "" || c !== "") return false;
            if (b === "") return false;
            return `<h1 class="${this.css.title}">${b}</h1>`;
        };

        var isBlank = (a) => {
            if (a === undefined) return false;
            if (a === '' || a.length === 0) return '<br>';
            return false;
        };

        var isItemize = (a) => {
            if (a === undefined || a.length < 2) return false;
            if (a[0] !== '-') return false;
            if (a[1] !== ' ') return false;
            return a.substring(2, a.length);
        }

        var makeTxt = (a, wrapSpan=true) => {
            if (a === undefined || a.length === '') return false;
            a = a.trim();

            var links = a.match(/\"[^\"]+\"/g);
            if (links !== null) {
                for (var i = 0; i < links.length; i++) {
                    var link = links[i];
                    var b = link.replace(/\"/gi, '');
                    if (b.indexOf('(*') !== -1 && b.indexOf(')') !== -1) {
                        // a
                        var noteNum = b.match(/\(\*.+\)/)[0].replace('(*', '').replace(')', '');
                        var url = self.notes['note_' + noteNum];
                        console.info(url);
                    }else if (b.indexOf('[') !== -1 && b.indexOf(']') !== -1){
                        // img
                    }else {
                        // a
                        var aTag = `<a href="#">${b}</a>`;
                        a = a.replace(link, aTag);
                    }
                }
            }

            if (wrapSpan) return `<span class="${this.css.txt}">${a}</span><br>`;
            return a;
        };


        var rows = this.rows;
        for (var i = 0; i < this.rows.length; i++) {
            var row = rows[i];

            // タイトルであるかどうか判定
            var title = isTitle(rows[i], rows[i + 1], rows[i + 2]);
            if (title) {
                this.htmls.push(title);
                i = i + 2;
                continue;
            }

            // 空行(改行)であるか
            var blank = isBlank(rows[i]);
            if (blank) {
                this.htmls.push(blank);
                continue;
            }

            var itemize = isItemize(rows[i]);
            if (itemize) {
                this.htmls.push(`<li class="${this.css.item}">${makeTxt(itemize, false)}</li>`);
                continue;
            }
            // 残りはテキスト行
            // リンクを含むかどうか調べてタグを生成する
            var txt = makeTxt(rows[i]);
            if (txt) {
                this.htmls.push(txt);
                continue;
            }
        }
    }

    /**
      * htmlsを描画する
      */
    renderHTML () {
        if (this.$stage.length === 0) return;

        var htmls = this.htmls;
        htmls.forEach(html => {
            this.$stage.append($(html));
        });
    }

    /**
     * 生成されたHTMLを描画する
     */
    render ($stage) {
        this.$stage = $stage;
        this.$stage.append(`<div id="stage-simple-web"></div>`);
        this.renderHTML();
    }
}
