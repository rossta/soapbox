Simple = (function(s, $, w) {
  $.fn.dl = $.fn.delegate;
  $.fn.tr = $.fn.trigger;
  
  var S = s,
  pro = "prototype",
  doc = document,
  methods = {
    init: function() {
      var au, sw, s;
      sx = new S.Sx();
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
      var self = this;
      this.archive = new S.Archive();
      self.forEach("init");
      $("a.toggle").bind("click", function() {
        self.forEach("toggle");
      });
      this.bind("toggle.smp", function() {
        self.forEach("toggle");
      });
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
      var slides = this.rt(k), 
      soapboxes = this.rt("soapboxes");
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

      this.store("soapboxes", soapboxes);
      this.k = k;
      this.s = slides;
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
      this.s[id] = value;
      return this.store(this.k, this.s);
    },
    store: function(k, data) {
      return this.archive.store(k, data);
    },
    all: function(callback) {
      var num = 0,
          mk = this.s[num];
      while (mk) {
        callback({
          num: num,
          mk: mk
        });
        mk = this.s[++num];
      }
      return this;
    },
    clear: function() {
      return this.archive.clear();
    }
  };

  S.Au = function(sel) {
    sel = sel || "#au";
    this.sel   = sel;
    this.$sel  = $(sel);
    this.$pre   = this.$sel.find('#pre');
    this.$ta  = this.$sel.find('textarea');
    this.$pgs  = this.$sel.find('#pgs');
  };
  S.Au[pro] = {
    init: function() {
      this.hide();
      this.listen();
    },
    listen: function() {
      var self = this;
      this.$sel.
        dl("textarea", "keyup change", function() {
          var $this = $(this),
              mk = $this.val();
              slideId = $this.attr("name");
          $("#" + slideId).html(mkup(mk));
          self.sx.save(slideId.split("_")[1], mk);
        }).
        dl("#pre", "click", function() {
          $(this).next().find("textarea").focus();
        }).
        dl("a.pl", "click", function() {
          self.sx.tr("pl.smp");
          return false;
        }).
        dl("a.ins", "click", function() {
          self.ins(self.$pre.children().length, "# New Slide");
          return false;
        }).
        dl("a.new", "click", function() {
          self.createNew();
          return false;
        }).
        dl("#pgs a", "click", function() {
          self.display(parseInt($(this).html(), 10) - 1);
          return false;
        }).
        dl(".home", "click", function() {
          return w.location.reload();
        });
      self.sx.
        bind("new.smp", function() {
          self.createNew();
        }).
        bind("edit.smp", function() {
          self.load(self.sx.k);
        });
        
    },
    hide: function() {
      return this.$sel.hide();
    },
    show: function() {
      return this.$sel.show();
    },
    createNew: function() {
      var self = this, title = prompt("Save New Slideshow As...");
      self.load(title);
      self.$pre.empty();
      self.$pgs.empty();
      self.ins(0, "# New Slideshow");
      self.show();
    },
    display: function(index, value) {
      var self = this, slideId = "slide_" + index;
      value = value || self.sx.get(index);
      $("div.slide").hide();
      $("[id$=" + slideId +"]").show();
      self.$pgs.children().removeClass("current").filter(":eq("+ index+")").addClass("current");
      self.$ta.attr("name", slideId).val(value);
      self.$ta.change();
      return this;
    },
    ins: function(index, html) {
      var self = this;
      $("<div></div>").
        attr("id", "slide_" + index).
        attr("class", "slide card padding").
        html(mkup(html)).
        appendTo(self.$pre).hide();
      $("<a href='#'></a>").html(index + 1).appendTo(self.$pgs);
      self.sx.save(index, html);
      self.display(index);
      return this;
    },
    toggle: function() {
      return this.$sel.toggle();
    },
    load: function(k) {
      var self = this;
      self.sx.load(k);
      self.sx.all(function(data) {
        self.ins(parseInt(data.num, 10), data.mk);
      });
      self.display(0);
    }
  };

  S.Sw = function(sel) {
    sel = sel || "#sw";
    this.sel   = sel;
    this.$sel  = $(sel);
    this.$screen    = this.$sel.find(".screen");
    this.$exit      = this.$sel.find(".exit");
  };
  S.Sw[pro] = {
    init: function() {
      this.hide();
      this.listen();
    },
    listen: function() {
      var self = this;
      this.$sel.dl("a.exit", "click", function() {
        self.sx.tr("stop.smp");
      });
      self.sx.
        bind("pl.smp", function() {
          self.pl();
        }).
        bind("loaded.smp", function(e, data) {
          self.show();
        }).
        bind("next.smp", function() {
          self.next();
        }).
        bind("prev.smp", function() {
          self.prev();
        });
    },
    hide: function() {
      this.$exit.hide();
      return this.$sel.hide();
    },
    show: function() {
      this.$exit.show();
      return this.$sel.show();
    },
    toggle: function() {
      this.$exit.toggle();
      return this.$sel.toggle();
    },
    pl: function() {
      var self = this;
      self.$screen.empty();
      self.sx.all(function(data) {
        $("<div></div>").
          attr("id", "simple" + data.slideId).
          html(mkup(data.mk)).
          appendTo(self.$screen).hide();
      });
      self.$screen.children().addClass("slide").first().cell();
      self.sx.tr("loaded.smp");
    },
    next: function() {
      var $next = this.$screen.children(":visible").hide().next();
      if ($next.length) $next.cell();
      else {
        self.sx.tr("stop.smp").tr("toggle.smp");
      }
    },
    prev: function() {
      var $prev = this.$screen.children(":visible").hide().prev();
      if ($prev.length) $prev.cell();
      else {
        self.sx.tr("stop.smp").tr("toggle.smp");
      }
    }
  };
  S.We = function(sel) {
    sel = sel || "#welcome";
    this.sel   = sel;
    this.$sel  = $(sel);
    this.$screen    = this.$sel.find(".screen");
    this.soapboxes  = [];
  };
  S.We[pro] = {
    init: function() {
      var self = this;
      this.show();
      this.$sel.
        dl("a.pl", "click", function() {
          self.sx.load($(this).text());
          self.hide();
          self.sx.tr("edit.smp").tr("pl.smp");
        });
    },
    hide: function() {
      return this.$sel.hide();
    },
    show: function() {
      var self = this;
      this.sx.load();
      this.soapboxes = this.sx.rt("soapboxes");
      $.map(this.soapboxes, function(title) {
        $("<a href='#'></a>").html(title).addClass("pl").appendTo(self.$screen);
      });
      $("<hr />").appendTo(self.$screen);
      $("<a href='#'></a>").html("new").appendTo(self.$screen).click(function() {
        self.sx.tr("new.smp");
        self.hide();
      });
      return this.$sel.show();
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
    this.EDIT = "edit";
    this.SHOW = "show";
    this.context = this.EDIT;
  };
  S.Ky[pro] = {
    ks: {
      space : 32,
      left  : 37,
      right : 39,
      esc   : 27
    },
    init: function() {
      var self = this,
      ks = self.ks;
      self.sx.
        bind("pl.smp", function() {
          self.context = self.SHOW;
        }).
        bind("stop.smp", function() {
          self.context = self.EDIT;
        }).
        bind("keydown", function(e) {
          var k = e.keyCode;
          switch (self.context) {
            case self.EDIT:
              log(k);
              break;
            case self.SHOW:
              switch (k) {
                case ks.space:
                  log("space");
                  break;
                case ks.left:
                  self.sx.tr("prev.smp");
                  break;
                case ks.right:
                  self.sx.tr("next.smp");
                  break;
                case ks.esc:
                  self.sx.tr("stop.smp");
                  self.sx.tr("toggle.smp");
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

  $.fn.cell = function() {
    return this.css({
      'display': 'table-cell',
      'vertical-align': 'middle'
    });
  };

  return $.extend(S, methods);
})({}, jQuery, window);