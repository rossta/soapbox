Simple = (function(s, win) {
  var S = s,
  proto = "prototype",
  methods = {
    generate: function() {
      var author, slideshow, s;
      sandbox = new S.Sandbox();
      sandbox.add(S.Author);
      sandbox.add(S.Slideshow);
      sandbox.init();
    }
  },
  log = function() {
    if (window.console && window.console.log && typeof window.console.log.apply == 'function') {
      window.console.log.apply(window.console, arguments);
    }
  };

  S.Sandbox = function() {
    this.modules = [];
    this.add = function(klass) {
      var module = new klass();
      module.sandbox = this;
      this.modules.push(module);
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
          $("#" + slideId).html(markdown);
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
  };
  S.Slideshow[proto] = {
    init: function() {
      this.hide();
      this.listen();
    },
    listen: function() {
      var self = this;
      self.sandbox.bind("play.simple", function() {
        self.play();
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
      log("Play");
      this.show();
    }
  };


  return $.extend(S, methods);
})({}, window);