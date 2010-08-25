Simple = (function(s, $, w) {
  $.fn.dl = $.fn.delegate;
  
  var S = s,
  pro = "prototype",
  methods = {
    generate: function() {
      var author, slideshow, s;
      sx = new S.Sandbox();
      sx.
        add(S.Author).
        add(S.Slideshow).
        add(S.Welcome).
        add(S.KeyListener).
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
  markup = function(mk) {
    return throwdown(mk).toH();
  };

  S.Sandbox = function() {
    this.ms = [];
  };
  S.Sandbox[pro] = {
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
      this.bind("toggle.simple", function() {
        self.forEach("toggle");
      });
    },
    trigger: function(event, data) {
      return $(document).trigger(event, data);
    },
    bind: function(event, callback) {
      return $(document).bind(event, callback);
    },
    forEach: function(fn) {
      $.map(this.ms, function(m) {
        if (typeof m[fn] == 'function') m[fn]();
      });
    },
    load: function(key) {
      key = key || "demo";
      var slides = this.retrieve(key), 
      soapboxes = this.retrieve("soapboxes");
      if (!slides) {
        slides = [];
        if (key == "demo") {
          slides = [
          "# Create slides", 
          "with text",
          "<h2>html</h2>",
          "# and (some) markdown",
          "# Any questions?"
          ];
        }
      }
      if (!soapboxes) soapboxes = [key];
      if ($.inArray(key, soapboxes) < 0) soapboxes.push(key); 

      this.store("soapboxes", soapboxes);
      this.key = key;
      this.s = slides;
      return slides;
    },
    retrieve: function(key) {
      return this.archive.retrieve(key);
    },
    get: function(id) {
      return this.s[id];
    },
    save: function(id, value) {
      log("Saving", id, value);
      this.s[id] = value;
      return this.store(this.key, this.s);
    },
    store: function(key, data) {
      return this.archive.store(key, data);
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

  S.Author = function(sel) {
    sel = sel || "#author";
    this.sel   = sel;
    this.$sel  = $(sel);
    this.$pre   = this.$sel.find('#pre');
    this.$textarea  = this.$sel.find('textarea');
    this.$paginate  = this.$sel.find('#pagination');
  };
  S.Author[pro] = {
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
          $("#" + slideId).html(markup(mk));
          self.sx.save(slideId.split("_")[1], mk);
        }).
        dl("#pre", "click", function() {
          $(this).next().find("textarea").focus();
        }).
        dl("a.pl", "click", function() {
          self.sx.trigger("pl.simple");
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
        dl("#pagination a", "click", function() {
          self.display(parseInt($(this).html(), 10) - 1);
          return false;
        }).
        dl(".home", "click", function() {
          return w.location.reload();
        });
      self.sx.
        bind("new.simple", function() {
          self.createNew();
        }).
        bind("edit.simple", function() {
          self.load(self.sx.key);
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
      self.$paginate.empty();
      self.ins(0, "# New Slideshow");
      self.show();
    },
    display: function(index, value) {
      var self = this, slideId = "slide_" + index;
      value = value || self.sx.get(index);
      $("div.slide").hide();
      $("[id$=" + slideId +"]").show();
      self.$paginate.children().removeClass("current").filter(":eq("+ index+")").addClass("current");
      self.$textarea.attr("name", slideId).val(value);
      self.$textarea.change();
      return this;
    },
    ins: function(index, html) {
      var self = this;
      $("<div></div>").
        attr("id", "slide_" + index).
        attr("class", "slide card padding").
        html(markup(html)).
        appendTo(self.$pre).hide();
      $("<a href='#'></a>").html(index + 1).appendTo(self.$paginate);
      self.sx.save(index, html);
      self.display(index);
      return this;
    },
    toggle: function() {
      return this.$sel.toggle();
    },
    load: function(key) {
      var self = this;
      self.sx.load(key);
      self.sx.all(function(data) {
        self.ins(parseInt(data.num, 10), data.mk);
      });
      self.display(0);
    }
  };

  S.Slideshow = function(sel) {
    sel = sel || "#slideshow";
    this.sel   = sel;
    this.$sel  = $(sel);
    this.$screen    = this.$sel.find(".screen");
    this.$exit      = this.$sel.find(".exit");
  };
  S.Slideshow[pro] = {
    init: function() {
      this.hide();
      this.listen();
    },
    listen: function() {
      var self = this;
      this.$sel.dl("a.exit", "click", function() {
        self.sx.trigger("stop.simple");
      });
      self.sx.
        bind("pl.simple", function() {
          self.pl();
        }).
        bind("loaded.simple", function(e, data) {
          self.show();
        }).
        bind("next.simple", function() {
          self.next();
        }).
        bind("prev.simple", function() {
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
          html(markup(data.mk)).
          appendTo(self.$screen).hide();
      });
      self.$screen.children().addClass("slide").first().cell();
      self.sx.trigger("loaded.simple");
    },
    next: function() {
      var $next = this.$screen.children(":visible").hide().next();
      if ($next.length) $next.cell();
      else {
        self.sx.trigger("stop.simple").trigger("toggle.simple");
      }
    },
    prev: function() {
      var $prev = this.$screen.children(":visible").hide().prev();
      if ($prev.length) $prev.cell();
      else {
        self.sx.trigger("stop.simple").trigger("toggle.simple");
      }
    }
  };
  S.Welcome = function(sel) {
    sel = sel || "#welcome";
    this.sel   = sel;
    this.$sel  = $(sel);
    this.$screen    = this.$sel.find(".screen");
    this.soapboxes  = [];
  };
  S.Welcome[pro] = {
    init: function() {
      var self = this;
      this.show();
      this.$sel.
        dl("a.pl", "click", function() {
          self.sx.load($(this).text());
          self.hide();
          self.sx.trigger("edit.simple").trigger("pl.simple");
        });
    },
    hide: function() {
      return this.$sel.hide();
    },
    show: function() {
      var self = this;
      this.sx.load();
      this.soapboxes = this.sx.retrieve("soapboxes");
      $.map(this.soapboxes, function(title) {
        $("<a href='#'></a>").html(title).addClass("pl").appendTo(self.$screen);
      });
      $("<hr />").appendTo(self.$screen);
      $("<a href='#'></a>").html("new").appendTo(self.$screen).click(function() {
        self.sx.trigger("new.simple");
        self.hide();
      });
      return this.$sel.show();
    }
  };
  
  S.Archive = function() {
    this.db = S.Archive.connection;
  };
  S.Archive[pro] = {
    retrieve: function(key) {
      var s = this.db[key];
      if (s) return JSON.parse(s);
      else return null;
    },
    store: function(key, data) {
      this.db[key] = JSON.stringify(data);
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

  S.KeyListener = function() {
    this.EDIT = "edit";
    this.SHOW = "show";
    this.context = this.EDIT;
  };
  S.KeyListener[pro] = {
    keys: {
      space : 32,
      left  : 37,
      right : 39,
      esc   : 27
    },
    init: function() {
      var self = this,
      keys = self.keys;
      self.sx.
        bind("pl.simple", function() {
          self.context = self.SHOW;
        }).
        bind("stop.simple", function() {
          self.context = self.EDIT;
        }).
        bind("keydown", function(e) {
          var key = e.keyCode;
          switch (self.context) {
            case self.EDIT:
              switch (key) {
                case keys.left:
                  self.sx.trigger("prev.simple");
                  break;
                case keys.right:
                  self.sx.trigger("next.simple");
                  break;
                default:
                  log(key);
                  break;
              }
            case self.SHOW:
              switch (key) {
                case keys.space:
                  log("space");
                  break;
                case keys.left:
                  self.sx.trigger("prev.simple");
                  break;
                case keys.right:
                  self.sx.trigger("next.simple");
                  break;
                case keys.esc:
                  self.sx.trigger("stop.simple");
                  self.sx.trigger("toggle.simple");
                  break;
                default:
                  log(key);
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