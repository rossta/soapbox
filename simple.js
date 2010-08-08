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
  };
  S.Author[proto] = {
    init: function() {
      var val = this.sandbox.get("slide1") || "# Simple Slides";
      this.listen();
      this.$selector.find('textarea').val(val).change();
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
      var self = this;
      self.$screen.empty();
      self.sandbox.load(function(data) {
        $("<div></div>").
          attr("id", "simple" + data.slideId).
          html(markup(data.markdown)).
          appendTo(self.$screen);
      });
    }
  };

  S.Archive = function() {
    this.db = window.localStorage || {};
    this.keys = [];
  };
  S.Archive[proto] = {
    init: function() {},
    save: function(data) {
      log("Saving", data.key, data.val);
      return this.db[data.key] = data.val;
    },
    get: function(key) {
      this.db[key];
    },
    length: function() {
      this.db.length;
    },
    load: function(callback) {
      var slide = "slide",
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

  return $.extend(S, methods);
})({}, window);