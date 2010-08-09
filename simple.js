Simple = (function(s, win) {
  var S = s,
  proto = "prototype",
  methods = {
    generate: function() {
      var author, slideshow, s;
      sandbox = new S.Sandbox();
      sandbox.
        add(S.Author).
        add(S.Slideshow).
        add(S.KeyListener).
        init();
      Simple.app = sandbox;
      return sandbox;
    }
  },
  log = function() {
    if (window.console && window.console.log && typeof window.console.log.apply == 'function') {
      window.console.log.apply(window.console, arguments);
    }
  },
  markup = function(markdown) {
    return throwdown(markdown).toHtml();
  };

  S.Sandbox = function() {
    this.modules = [];
  };
  S.Sandbox[proto] = {
    add: function(klass) {
      var module = new klass();
      module.sandbox = this;
      this.modules.push(module);
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
      $.map(this.modules, function(module) {
        if (typeof module[fn] == 'function') module[fn]();
      });
    },
    get: function(key) {
      return this.archive.get(key);
    },
    save: function(data) {
      return this.archive.save(data);
    },
    load: function(callback) {
      return this.archive.load(callback);
    }
  };

  S.Author = function(selector) {
    selector = selector || "#author";
    this.selector   = selector;
    this.$selector  = $(selector);
    this.$preview   = this.$selector.find('#preview');
    this.$textarea  = this.$selector.find('textarea');
  };
  S.Author[proto] = {
    init: function() {
      var val = this.sandbox.get("slide1") || "# Simple Slides";
      this.listen();
      this.$textarea.val(val).change();
    },
    listen: function() {
      var self = this;
      this.$selector.
        delegate("textarea", "keyup change", function() {
          var $this = $(this),
              markdown = $this.val();
              slideId = $this.attr("name");
          $("#" + slideId).html(markup(markdown));
          self.sandbox.save({
            key: slideId,
            val: markdown
          });
        }).
        delegate("a.play", "click", function() {
          self.sandbox.trigger("play.simple");
        }).
        delegate("a.new", "click", function() {
          var slideId, $slide, split;
          $slide = self.$preview.children().hide().last();
          slideId = $slide.attr("id").replace(/\d+/, function(match) {
            return parseInt(match, 10) + 1;
          });
          $slide.clone().attr("id", slideId).appendTo(self.$preview).show();
          self.$textarea.attr("name", slideId).val("# New Slide").change();
        });
    },
    hide: function() {
      this.$selector.hide();
    },
    show: function() {
      this.$selector.show();
    },
    toggle: function() {
      return this.$selector.toggle();
    }
  };

  S.Slideshow = function(selector) {
    selector = selector || "#slideshow";
    this.selector   = selector;
    this.$selector  = $(selector);
    this.$screen    = $("#screen");
  };
  S.Slideshow[proto] = {
    init: function() {
      this.hide();
      this.listen();
    },
    listen: function() {
      var self = this;
      this.$selector.delegate("a.exit", "click", function() {
        self.sandbox.trigger("stop.simple");
      });
      self.sandbox.
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
    },
    hide: function() {
      return this.$selector.hide();
    },
    show: function() {
      return this.$selector.show();
    },
    toggle: function() {
      return this.$selector.toggle();
    },
    play: function() {
      var self = this;
      self.$screen.empty();
      self.sandbox.load(function(data) {
        $("<div></div>").
          attr("id", "simple" + data.slideId).
          html(markup(data.markdown)).
          appendTo(self.$screen).hide();
      });
      self.$screen.children().first().show();
    },
    next: function() {
      var $next = this.$screen.children(":visible").hide().next();
      if ($next.length) $next.show();
      else {
        self.sandbox.trigger("stop.simple").trigger("toggle.simple");
      }
    },
    prev: function() {
      var $prev = this.$screen.children(":visible").hide().prev();
      if ($prev.length) $prev.show();
      else {
        self.sandbox.trigger("stop.simple").trigger("toggle.simple");
      }
    }
  };

  S.Archive = function() {
    this.db = window.localStorage || {};
    this.keys = [];
  };
  S.Archive[proto] = {
    save: function(data) {
      log("Saving", data.key, data.val);
      return this.db[data.key] = data.val;
    },
    get: function(key) {
      return this.db[key];
    },
    load: function(callback) {
      var slide = "slide_",
          num   = 1,
          markdown  = this.db[slide + num];
      while (markdown) {
        callback({
          slideId: slideId,
          markdown: markdown
        });
        markdown = this.db[slide + ++num];
      }
      return self.sandbox.trigger("loaded.simple");
    }
  };

  S.KeyListener = function() {
    this.EDIT = "edit";
    this.SHOW = "show";
    this.context = this.EDIT;
  };
  S.KeyListener[proto] = {
    keys: {
      space : 32,
      left  : 37,
      right : 39,
      esc   : 27
    },
    init: function() {
      var self = this,
      keys = self.keys;
      self.sandbox.
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
              log("keydown while editing");
              break;
            case self.SHOW:
              switch (key) {
                case keys.space:
                  log("space");
                  break;
                case keys.left:
                  self.sandbox.trigger("prev.simple");
                  break;
                case keys.right:
                  self.sandbox.trigger("next.simple");
                  break;
                case keys.esc:
                  self.sandbox.trigger("stop.simple");
                  self.sandbox.trigger("toggle.simple");
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

  return $.extend(S, methods);
})({}, window);