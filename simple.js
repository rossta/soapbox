Simple = (function(s, win) {
  var S = s,
  proto = "prototype",
  methods = {
    generate: function() {
      var author, slideshow, s;
      sandbox = new S.Sandbox();
      sandbox.
        add(S.Archive).
        add(S.Author).
        add(S.Slideshow).
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
    return markdown;
  };

  S.Sandbox = function() {
    this.modules = [];
    this.add = function(klass) {
      var module = new klass();
      module.sandbox = this;
      this.modules.push(module);
      return this;
    };
    this.init = function() {
      var self = this;
      self.forEach("init");
      $("a.toggle").bind("click", function() {
        self.forEach("toggle");
      });
    };
    this.trigger = function(event, data) {
      return $(document).trigger(event, data);
    };
    this.bind = function(event, callback) {
      return $(document).bind(event, callback);
    };
    this.forEach = function(fn) {
      $.map(this.modules, function(module) {
        if (typeof module[fn] == 'function') module[fn]();
      });
    };
  };

  S.Author = function(selector) {
    selector = selector || "#author";
    this.selector   = selector;
    this.$selector  = $(selector);
  };
  S.Author[proto] = {
    init: function() {
      this.listen();
      this.$selector.find('textarea').val("# Simple Slides").change();
    },
    listen: function() {
      var self = this;
      this.$selector.
        delegate("textarea", "keyup change", function() {
          var $this = $(this),
              markdown = $this.val();
              slideId = $this.attr("name");
          $("#" + slideId).html(markup(markdown));
          self.sandbox.trigger("save.simple", {
            key: slideId,
            val: markdown
          });
        }).
        delegate("a.play", "click", function() {
          self.sandbox.trigger("play.simple");
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
      self.sandbox.
        bind("play.simple", function() {
          self.play();
        }).
        bind("loading.simple", function(e, data) {
          $("<div></div>").
            attr("id", "simple" + data.slideId).
            html(markup(data.markdown)).
            appendTo(self.$screen);
        }).
        bind("loaded.simple", function(e, data) {
          self.show();
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
      this.$screen.empty();
      this.sandbox.trigger("load.simple");
    }
  };

  S.Archive = function() {
    this.db = window.localStorage || {};
    this.keys = [];
  };
  S.Archive[proto] = {
    init: function() {
      this.listen();
    },
    listen: function() {
      var self = this;
      self.sandbox.
        bind("save.simple", function(e, data) {
          self.save(data);
        }).
        bind("load.simple", function() {
          self.load();
        });
    },
    save: function(data) {
      log("Saving", data.key, data.val);
      return this.db[data.key] = data.val;
    },
    load: function() {
      var slide = "slide",
          num   = 1,
          markdown  = this.db[slide + num];
      while (markdown) {
        self.sandbox.trigger("loading.simple", {
          slideId: slideId,
          markdown: markdown
        });
        markdown = this.db[slide + ++num];
      }
      self.sandbox.trigger("loaded.simple");
      return this.db[key];
    }
  };

  return $.extend(S, methods);
})({}, window);