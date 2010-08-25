Simple = (function(s, $, w) {
  $.fn.dl = $.fn.delegate;
  $.fn.tr = $.fn.trigger;
  $.fn.nx = $.fn.next;
  $.fn.pv = $.fn.prev;
  $.fn.tg = $.fn.toggle;
  
  var S = s,
  pro = "prototype",
  doc = document,
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
  log = function() {
    if (w.console && w.console.log && typeof w.console.log.apply == 'function') {
      w.console.log.apply(w.console, arguments);
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
      t.archive = new S.Archive();
      t.forEach("init");
      $("a.tg").bind("click", function() {
        t.forEach("tg");
      });
      t.bind("tg.smp", function() {
        t.forEach("tg");
      });
      return t;
    },
    tr: function(event, data) {
      return $(doc).tr(event, data);
    },
    bind: function(event, callback) {
      return $(doc).bind(event, callback);
    },
    forEach: function(fn) {
      $.map(this.ms, function(m) {
        if (typeof m[fn] == 'function') m[fn]();
      });
    },
    load: function(k) {
      k = k || "demo";
      var t = this, slides = t.rt(k), 
      soapboxes = t.rt("soapboxes");
      if (!slides) {
        slides = [];
        if (k == "demo") {
          slides = [
          "# Create slides", 
          "with text",
          "<h2>html</h2>",
          "# and (some) markdown",
          "# Any questions?"
          ];
        }
      }
      if (!soapboxes) soapboxes = [k];
      if ($.inArray(k, soapboxes) < 0) soapboxes.push(k); 

      t.store("soapboxes", soapboxes);
      t.k = k;
      t.s = slides;
      return slides;
    },
    rt: function(k) {
      return this.archive.rt(k);
    },
    get: function(id) {
      return this.s[id];
    },
    save: function(id, value) {
      log("Saving", id, value);
      var t = this;
      t.s[id] = value;
      return t.store(t.k, t.s);
    },
    store: function(k, data) {
      return this.archive.store(k, data);
    },
    all: function(callback) {
      var t = this,
          num = 0,
          mk = t.s[num];
      while (mk) {
        callback({
          num: num,
          mk: mk
        });
        mk = t.s[++num];
      }
      return t;
    },
    clear: function() {
      return this.archive.clear();
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
              slideId = $this.attr("name");
          $("#" + slideId).html(mkup(mk));
          t.sx.save(slideId.split("_")[1], mk);
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
        dl("a.new", "click", function() {
          t.createNew();
          return false;
        }).
        dl("#pgs a", "click", function() {
          t.display(parseInt($(this).html(), 10) - 1);
          return false;
        }).
        dl(".home", "click", function() {
          return w.location.reload();
        });
      t.sx.
        bind("new.smp", function() {
          t.createNew();
        }).
        bind("edit.smp", function() {
          t.load(t.sx.k);
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
      t.load(title);
      t.$pre.empty();
      t.$pgs.empty();
      t.ins(0, "# New Slideshow");
      t.show();
    },
    display: function(index, value) {
      var t = this, slideId = "slide_" + index;
      value = value || t.sx.get(index);
      $("div.slide").hide();
      $("[id$=" + slideId +"]").show();
      t.$pgs.children().removeClass("current").filter(":eq("+ index+")").addClass("current");
      t.$ta.attr("name", slideId).val(value);
      t.$ta.change();
      return t;
    },
    ins: function(index, html) {
      var t = this;
      $("<div></div>").
        attr("id", "slide_" + index).
        attr("class", "slide card padding").
        html(mkup(html)).
        appendTo(t.$pre).hide();
      $("<a href='#'></a>").html(index + 1).appendTo(t.$pgs);
      t.sx.save(index, html);
      t.display(index);
      return t;
    },
    tg: function() {
      return this.$sel.tg();
    },
    load: function(k) {
      var t = this;
      t.sx.load(k);
      t.sx.all(function(data) {
        t.ins(parseInt(data.num, 10), data.mk);
      });
      t.display(0);
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
        bind("loaded.smp", function(e, data) {
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
          attr("id", "simple" + data.slideId).
          html(mkup(data.mk)).
          appendTo(t.$sc).hide();
      });
      t.$sc.children().addClass("slide").first().cl();
      t.sx.tr("loaded.smp");
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
    t.soapboxes  = [];
  };
  S.We[pro] = {
    init: function() {
      var t = this;
      t.show();
      t.$sel.
        dl("a.pl", "click", function() {
          t.sx.load($(this).text());
          t.hide();
          t.sx.tr("edit.smp").tr("pl.smp");
        });
    },
    hide: function() {
      return this.$sel.hide();
    },
    show: function() {
      var t = this;
      t.sx.load();
      t.soapboxes = t.sx.rt("soapboxes");
      $.map(t.soapboxes, function(title) {
        $("<a href='#'></a>").html(title).addClass("pl").appendTo(t.$sc);
      });
      $("<hr />").appendTo(t.$sc);
      $("<a href='#'></a>").html("new").appendTo(t.$sc).click(function() {
        t.sx.tr("new.smp");
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
    t.context = t.EDIT;
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
          t.context = t.SHOW;
        }).
        bind("stop.smp", function() {
          t.context = t.EDIT;
        }).
        bind("keydown", function(e) {
          var k = e.keyCode;
          switch (t.context) {
            case t.EDIT:
              log(k);
              break;
            case t.SHOW:
              switch (k) {
                case ks.space:
                  log("space");
                  break;
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
                  log(k);
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