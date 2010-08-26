Simple = (function(s, $, win) {
  var S = s,
  pro = "prototype",
  doc = document,
  methods = {
    init: function() {
      var author, slideshow, s;
      sandbox = new S.Sandbox();
      sandbox.
        add(S.Author).
        add(S.Slideshow).
        add(S.Welcome).
        add(S.KeyListener).
        init();
      Simple.app = sandbox;
      return sandbox;
    }
  },
  log = function() {
    var cons = win.console;
    if (cons && cons.log && typeof cons.log.apply == 'function') {
      cons.log.apply(cons, arguments);
    }
  },
  markup = function(markdown) {
    return throwdown(markdown).toH();
  };

  S.Sandbox = function() {
    this.modules = [];
  };
  S.Sandbox[pro] = {
    add: function(klass) {
      var self = this, module = new klass();
      module.sandbox = this;
      self.modules.push(module);
      return self;
    },
    init: function() {
      var self = this;
      self.archive = new S.Archive();
      self.forEach("init");
      $("a.toggle").bind("click", function() {
        self.forEach("toggle");
      });
      self.bind("toggle.simple", function() {
        self.forEach("toggle");
      });
    },
    trigger: function(event, data) {
      return $(doc).trigger(event, data);
    },
    bind: function(event, callback) {
      return $(doc).bind(event, callback);
    },
    forEach: function(fn) {
      $.map(this.modules, function(module) {
        if (typeof module[fn] == 'function') module[fn]();
      });
    },
    load: function(key) {
      key = key || "demo";
      var self = this,
      slides = self.retrieve(key), 
      soapboxes = self.retrieve("soapboxes");
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

      self.store("soapboxes", soapboxes);
      self.key = key;
      self.slides = slides;
      return slides;
    },
    retrieve: function(key) {
      return this.archive.retrieve(key);
    },
    get: function(id) {
      return this.slides[id];
    },
    save: function(id, value) {
      log("Saving", id, value);
      var self = this;
      self.slides[id] = value;
      return self.store(self.key, self.slides);
    },
    store: function(key, data) {
      return this.archive.store(key, data);
    },
    all: function(callback) {
      var self = this,
          num = 0,
          markdown = self.slides[num];
      while (markdown) {
        callback({
          num: num,
          markdown: markdown
        });
        markdown = self.slides[++num];
      }
      return self;
    },
    clear: function() {
      return this.archive.clear();
    }
  };

  S.Author = function(selector) {
    var self = this;
    selector = selector || "#author";
    self.selector   = selector;
    self.$selector  = $(selector);
    self.$preview   = self.$selector.find('#preview');
    self.$textarea  = self.$selector.find('textarea');
    self.$pages  = self.$selector.find('#pages');
  };
  S.Author[pro] = {
    init: function() {
      this.hide();
      this.listen();
    },
    listen: function() {
      var self = this, app = self.sandbox;
      self.$selector.
        delegate("textarea", "keyup change", function() {
          var $this = $(this),
              markdown = $this.val();
              slideId = $this.attr("name");
          $("#" + slideId).html(markup(markdown));
          app.save(slideId.split("_")[1], markdown);
        }).
        delegate("#preview", "click", function() {
          $(this).next().find("textarea").focus();
        }).
        delegate("a.play", "click", function() {
          app.trigger("play.simple");
          return false;
        }).
        delegate("a.insert", "click", function() {
          self.insert(self.$preview.children().length, "# New Slide");
          return false;
        }).
        delegate("a.new", "click", function() {
          self.createNew();
          return false;
        }).
        delegate("#pages a", "click", function() {
          self.display(parseInt($(this).html(), 10) - 1);
          return false;
        }).
        delegate(".home", "click", function() {
          return win.location.reload();
        });
      app.
        bind("new.simple", function() {
          self.createNew();
        }).
        bind("edit.simple", function() {
          self.load(app.key);
        });
      return self;
    },
    hide: function() {
      return this.$selector.hide();
    },
    show: function() {
      return this.$selector.show();
    },
    createNew: function() {
      var self = this, title = prompt("Save New Slideshow As...");
      self.load(title);
      self.$preview.empty();
      self.$pages.empty();
      self.insert(0, "# New Slideshow");
      self.show();
      return self;
    },
    display: function(index, value) {
      var self = this, slideId = "slide_" + index, app = self.sandbox;
      value = value || app.get(index);
      $("div.slide").hide();
      $("[id$=" + slideId +"]").show();
      self.$pages.children().removeClass("current").filter(":eq("+ index+")").addClass("current");
      self.$textarea.attr("name", slideId).val(value);
      self.$textarea.change();
      return self;
    },
    insert: function(index, html) {
      var self = this, app = self.sandbox;
      $("<div></div>").
        attr("id", "slide_" + index).
        attr("class", "slide card padding").
        html(markup(html)).
        appendTo(self.$preview).hide();
      $("<a href='#'></a>").html(index + 1).appendTo(self.$pages);
      app.save(index, html);
      self.display(index);
      return self;
    },
    toggle: function() {
      return this.$selector.toggle();
    },
    load: function(key) {
      var self = this, app =self.sandbox;
      app.load(key);
      app.all(function(data) {
        self.insert(parseInt(data.num, 10), data.markdown);
      });
      self.display(0);
    }
  };

  S.Slideshow = function(selector) {
    var self = this;
    selector = selector || "#slideshow";
    self.selector   = selector;
    self.$selector  = $(selector);
    self.$screen    = self.$selector.find(".screen");
    self.$exit      = self.$selector.find(".exit");
  };
  S.Slideshow[pro] = {
    init: function() {
      this.hide();
      this.listen();
    },
    listen: function() {
      var self = this, app = self.sandbox;
      self.$selector.delegate("a.exit", "click", function() {
        app.trigger("stop.simple");
      });
      app.
        bind("play.simple", function() {
          self.play();
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
      return self;
    },
    hide: function() {
      var self = this;
      self.$exit.hide();
      return self.$selector.hide();
    },
    show: function() {
      var self = this;
      self.$exit.show();
      return self.$selector.show();
    },
    toggle: function() {
      var self = this;
      self.$exit.toggle();
      return self.$selector.toggle();
    },
    play: function() {
      var self = this, app = self.sandbox;
      self.$screen.empty();
      app.all(function(data) {
        $("<div></div>").
          attr("id", "simple" + data.slideId).
          html(markup(data.markdown)).
          appendTo(self.$screen).hide();
      });
      self.$screen.children().addClass("slide").first().cell();
      app.trigger("loaded.simple");
    },
    next: function() {
      var self = this,
          app = self.sandbox,
          $next = self.$screen.children(":visible").hide().next();
      if ($next.length) $next.cell();
      else {
        app.trigger("stop.simple").trigger("toggle.simple");
      }
    },
    prev: function() {
      var self = this,
          app = self.sandbox,
          $prev = self.$screen.children(":visible").hide().prev();
      if ($prev.length) $prev.cell();
      else {
        app.trigger("stop.simple").trigger("toggle.simple");
      }
    }
  };
  S.Welcome = function(selector) {
    var self = this;
    selector = selector || "#welcome";
    self.selector   = selector;
    self.$selector  = $(selector);
    self.$screen    = self.$selector.find(".screen");
    self.soapboxes  = [];
  };
  S.Welcome[pro] = {
    init: function() {
      var self = this,
      app = self.sandbox;
      self.show();
      self.$selector.
        delegate("a.play", "click", function() {
          app.load($(this).text());
          self.hide();
          app.trigger("edit.simple").trigger("play.simple");
        });
    },
    hide: function() {
      return this.$selector.hide();
    },
    show: function() {
      var self = this, app = self.sandbox;
      app.load();
      self.soapboxes = app.retrieve("soapboxes");
      $.map(self.soapboxes, function(title) {
        $("<a href='#'></a>").html(title).addClass("play").appendTo(self.$screen);
      });
      $("<hr />").appendTo(self.$screen);
      $("<a href='#'></a>").html("new").appendTo(self.$screen).click(function() {
        app.trigger("new.simple");
        self.hide();
      });
      return self.$selector.show();
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
      var self = this;
      self.db[key] = JSON.stringify(data);
      return self;
    },
    clear: function() {
      try {
        this.db.clear();
      } catch (e) {
        S.Archive.connection = win.localStorage || {};
      }
    }
  };
  S.Archive.connection = win.localStorage || {};

  S.KeyListener = function() {
    var self = this;
    self.EDIT = "edit";
    self.SHOW = "show";
    self.context = self.EDIT;
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
      app = self.sandbox,
      keys = self.keys;
      app.
        bind("play.simple", function() {
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
                  app.trigger("prev.simple");
                  break;
                case keys.right:
                  app.trigger("next.simple");
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
                  app.trigger("prev.simple");
                  break;
                case keys.right:
                  app.trigger("next.simple");
                  break;
                case keys.esc:
                  app.trigger("stop.simple");
                  app.trigger("toggle.simple");
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