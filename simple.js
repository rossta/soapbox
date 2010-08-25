Simple = (function(s, $, w) {
  $.fn.dl = $.fn.delegate;
  $.fn.tr = $.fn.trigger;
  $.fn.nx = $.fn.next;
  $.fn.pv = $.fn.prev;
  $.fn.tg = $.fn.toggle;
  
  var S = s,
  pro = "prototype",
  doc = document,
  ln = "<a href='#'></a>",
  methods = {
    init: function() {
      var sx = new S.Sx();
      sx.
        add(S.Au).
        add(S.Sw).
        add(S.We).
        add(S.Ky).
        init();
      Simple.app = sx;
      return sx;
    }
  },
  mkup = function(mk) {
    return throwdown(mk).toH();
  };

  S.Sx = function() {
    this.ms = [];
  };
  S.Sx[pro] = {
    add: function(klass) {
      var m = new klass();
      m.sx = this;
      this.ms.push(m);
      return this;
    },
    init: function() {
      var t = this;
      t.arc = new S.Archive();
      t.ech("init");
      $("a.tg").bind("click", function() {
        t.ech("tg");
      });
      t.bind("tg.smp", function() {
        t.ech("tg");
      });
      return t;
    },
    tr: function(event, data) {
      return $(doc).tr(event, data);
    },
    bind: function(event, callback) {
      return $(doc).bind(event, callback);
    },
    ech: function(fn) {
      $.map(this.ms, function(m) {
        if (typeof m[fn] == 'function') m[fn]();
      });
    },
    lo: function(k) {
      k = k || "demo";
      var t = this, sls = t.rt(k), 
      spb = t.rt("spb");
      if (!sls) {
        sls = [];
        if (k == "demo") {
          sls = [
          "# Create sls", 
          "with text",
          "<h2>html</h2>",
          "# and (some) markdown",
          "# Any questions?"
          ];
        }
      }
      if (!spb) spb = [k];
      if ($.inArray(k, spb) < 0) spb.push(k); 

      t.store("spb", spb);
      t.k = k;
      t.s = sls;
      return sls;
    },
    rt: function(k) {
      return this.arc.rt(k);
    },
    get: function(id) {
      return this.s[id];
    },
    save: function(id, value) {
      var t = this;
      t.s[id] = value;
      return t.store(t.k, t.s);
    },
    store: function(k, data) {
      return this.arc.store(k, data);
    },
    all: function(cbk) {
      var t = this,
          num = 0,
          mk = t.s[num];
      while (mk) {
        cbk({
          num: num,
          mk: mk
        });
        mk = t.s[++num];
      }
      return t;
    },
    clear: function() {
      return this.arc.clear();
    }
  };

  S.Au = function(sel) {
    sel = sel || "#au";
    var t = this;
    t.sel   = sel;
    t.$sel  = $(sel);
    t.$pre   = t.$sel.find('#pre');
    t.$ta  = t.$sel.find('textarea');
    t.$pgs  = t.$sel.find('#pgs');
  };
  S.Au[pro] = {
    init: function() {
      var t = this;
      t.hide();
      t.listen();
    },
    listen: function() {
      var t = this;
      t.$sel.
        dl("textarea", "keyup change", function() {
          var $this = $(this),
              mk = $this.val();
              slId = $this.attr("name");
          $("#" + slId).html(mkup(mk));
          t.sx.save(slId.split("_")[1], mk);
        }).
        dl("#pre", "click", function() {
          $(this).nx().find("textarea").focus();
        }).
        dl("a.pl", "click", function() {
          t.sx.tr("pl.smp");
          return false;
        }).
        dl("a.ins", "click", function() {
          t.ins(t.$pre.children().length, "# New Slide");
          return false;
        }).
        dl("a.nw", "click", function() {
          t.createNew();
          return false;
        }).
        dl("#pgs a", "click", function() {
          t.dp(parseInt($(this).html(), 10) - 1);
          return false;
        }).
        dl(".hm", "click", function() {
          return w.location.reload();
        });
      t.sx.
        bind("nw.smp", function() {
          t.createNew();
        }).
        bind("edit.smp", function() {
          t.lo(t.sx.k);
        });
        
    },
    hide: function() {
      return this.$sel.hide();
    },
    show: function() {
      return this.$sel.show();
    },
    createNew: function() {
      var t = this, title = prompt("Save New Slideshow As...");
      t.lo(title);
      t.$pre.empty();
      t.$pgs.empty();
      t.ins(0, "# New Slideshow");
      t.show();
    },
    dp: function(index, value) {
      var t = this, slId = "sl_" + index;
      value = value || t.sx.get(index);
      $("div.sl").hide();
      $("[id$=" + slId +"]").show();
      t.$pgs.children().removeClass("cur").filter(":eq("+ index+")").addClass("cur");
      t.$ta.attr("name", slId).val(value);
      t.$ta.change();
      return t;
    },
    ins: function(index, html) {
      var t = this;
      $("<div></div>").
        attr("id", "sl_" + index).
        attr("class", "sl ca pdg").
        html(mkup(html)).
        appendTo(t.$pre).hide();
      $(ln).html(index + 1).appendTo(t.$pgs);
      t.sx.save(index, html);
      t.dp(index);
      return t;
    },
    tg: function() {
      return this.$sel.tg();
    },
    lo: function(k) {
      var t = this;
      t.sx.lo(k);
      t.sx.all(function(data) {
        t.ins(parseInt(data.num, 10), data.mk);
      });
      t.dp(0);
    }
  };

  S.Sw = function(sel) {
    sel = sel || "#sw";
    var t = this;
    t.sel   = sel;
    t.$sel  = $(sel);
    t.$sc    = t.$sel.find(".sc");
    t.$ex      = t.$sel.find(".ex");
  };
  S.Sw[pro] = {
    init: function() {
      var t = this;
      t.hide();
      t.listen();
    },
    listen: function() {
      var t = this;
      t.$sel.dl("a.ex", "click", function() {
        t.sx.tr("stop.smp");
      });
      t.sx.
        bind("pl.smp", function() {
          t.pl();
        }).
        bind("loed.smp", function(e, data) {
          t.show();
        }).
        bind("nx.smp", function() {
          t.nx();
        }).
        bind("pv.smp", function() {
          t.pv();
        });
    },
    hide: function() {
      this.$ex.hide();
      return this.$sel.hide();
    },
    show: function() {
      this.$ex.show();
      return this.$sel.show();
    },
    tg: function() {
      this.$ex.tg();
      return this.$sel.tg();
    },
    pl: function() {
      var t = this;
      t.$sc.empty();
      t.sx.all(function(data) {
        $("<div></div>").
          html(mkup(data.mk)).
          appendTo(t.$sc).hide();
      });
      t.$sc.children().addClass("sl").first().cl();
      t.sx.tr("loed.smp");
    },
    nx: function() {
      var t = this, $nx = t.$sc.children(":visible").hide().nx();
      if ($nx.length) $nx.cl();
      else {
        t.sx.tr("stop.smp").tr("tg.smp");
      }
    },
    pv: function() {
      var t = this, $pv = t.$sc.children(":visible").hide().pv();
      if ($pv.length) $pv.cl();
      else {
        t.sx.tr("stop.smp").tr("tg.smp");
      }
    }
  };
  S.We = function(sel) {
    sel = sel || "#we";
    var t = this;
    t.sel   = sel;
    t.$sel  = $(sel);
    t.$sc    = t.$sel.find(".sc");
    t.spb  = [];
  };
  S.We[pro] = {
    init: function() {
      var t = this;
      t.show();
      t.$sel.
        dl("a.pl", "click", function() {
          t.sx.lo($(this).text());
          t.hide();
          t.sx.tr("edit.smp").tr("pl.smp");
        });
    },
    hide: function() {
      return this.$sel.hide();
    },
    show: function() {
      var t = this;
      t.sx.lo();
      t.spb = t.sx.rt("spb");
      $.map(t.spb, function(title) {
        $(ln).html(title).addClass("pl").appendTo(t.$sc);
      });
      $("<hr />").appendTo(t.$sc);
      $(ln).html("new").appendTo(t.$sc).click(function() {
        t.sx.tr("nw.smp");
        t.hide();
      });
      return t.$sel.show();
    }
  };
  
  S.Archive = function() {
    this.db = S.Archive.connection;
  };
  S.Archive[pro] = {
    rt: function(k) {
      var s = this.db[k];
      if (s) return JSON.parse(s);
      else return null;
    },
    store: function(k, data) {
      this.db[k] = JSON.stringify(data);
      return this;
    },
    clear: function() {
      try {
        this.db.clear();
      } catch (e) {
        S.Archive.connection = w.localStorage || {};
      }
    }
  };
  S.Archive.connection = w.localStorage || {};

  S.Ky = function() {
    var t = this;
    t.EDIT = "edit";
    t.SHOW = "show";
    t.cxt = t.EDIT;
  };
  S.Ky[pro] = {
    ks: {
      space : 32,
      left  : 37,
      right : 39,
      esc   : 27
    },
    init: function() {
      var t = this,
      ks = t.ks;
      t.sx.
        bind("pl.smp", function() {
          t.cxt = t.SHOW;
        }).
        bind("stop.smp", function() {
          t.cxt = t.EDIT;
        }).
        bind("keydown", function(e) {
          var k = e.keyCode;
          switch (t.cxt) {
            case t.SHOW:
              switch (k) {
                case ks.left:
                  t.sx.tr("pv.smp");
                  break;
                case ks.right:
                  t.sx.tr("nx.smp");
                  break;
                case ks.esc:
                  t.sx.tr("stop.smp");
                  t.sx.tr("tg.smp");
                  break;
                default:
                  break;
              }
              break;
          }
        });
    }
  };

  $.fn.cl = function() {
    return this.css({
      'display': 'table-cell',
      'vertical-align': 'middle'
    });
  };

  return $.extend(S, methods);
})({}, jQuery, window);