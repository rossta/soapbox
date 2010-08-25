Simple = (function(s, $, win) {
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
    load: function(key) {
      var slides = this.archive.retrieve(key);
      if (!slides) {
        slides = [];
        if (key == "demo") {
          slides = [
          "# Simply slides", 
          "# Using markdown"
          ];
        }
      }
      this.key = key;
      this.slides = slides;
      return slides;
    },
    get: function(id) {
      return this.slides[id];
    },
    save: function(id, value) {
      log("Saving", id, value);
      this.slides[id] = value;
      return this.store(this.slides);
    },
    store: function(data) {
      return this.archive.store(data);
    },
    all: function(callback) {
      var num = 0,
          markdown = this.slides[num];
      while (markdown) {
        callback({
          num: num,
          markdown: markdown
        });
        markdown = this.slides[++num];
      }
      return this;
    },
    clear: function() {
      return this.archive.clear();
    }
  };

  S.Author = function(selector) {
    selector = selector || "#author";
    this.selector   = selector;
    this.$selector  = $(selector);
    this.$preview   = this.$selector.find('#preview');
    this.$textarea  = this.$selector.find('textarea');
    this.$paginate  = this.$selector.find('#pagination');
  };
  S.Author[proto] = {
    init: function() {
      this.listen();
      this.load("demo");
      this.display(0);
    },
    listen: function() {
      var self = this;
      this.$selector.
        delegate("textarea", "keyup change", function() {
          var $this = $(this),
              markdown = $this.val();
              slideId = $this.attr("name");
          $("#" + slideId).html(markup(markdown));
          self.sandbox.save(slideId.split("_")[1], markdown);
        }).
        delegate("#preview", "click", function() {
          $(this).next().find("textarea").focus();
        }).
        delegate("a.play", "click", function() {
          self.sandbox.trigger("play.simple");
          return false;
        }).
        delegate("a.insert", "click", function() {
          self.insert(self.$preview.children().length, "# New Slide");
          return false;
        }).
        delegate("a.new", "click", function() {
          var title = prompt("Save New Slideshow As...");
          self.$preview.empty();
          self.$paginate.empty();
          self.load(title);
          self.insert(0, "# New Slideshow");
          self.show();
          return false;
        }).
        delegate("#pagination a", "click", function() {
          self.display(parseInt($(this).html(), 10) - 1);
          return false;
        });
    },
    hide: function() {
      return this.$selector.hide();
    },
    show: function() {
      return this.$selector.show();
    },
    display: function(index, value) {
      var self = this, slideId = "slide_" + index;
      value = value || self.sandbox.get(index);
      $("div.slide").hide();
      $("[id$=" + slideId +"]").show();
      self.$paginate.children().removeClass("current").filter(":eq("+ index+")").addClass("current");
      self.$textarea.attr("name", slideId).val(value);
      self.$textarea.change();
      return this;
    },
    insert: function(index, html) {
      var self = this;
      $("<div></div>").
        attr("id", "slide_" + index).
        attr("class", "slide card padding").
        html(markup(html)).
        appendTo(self.$preview).hide();
      $("<a href='#'></a>").html(index + 1).appendTo(self.$paginate);
      self.sandbox.save(index, html);
      self.display(index);
      return this;
    },
    toggle: function() {
      return this.$selector.toggle();
    },
    load: function(key) {
      var self = this;
      self.sandbox.load(key);
      self.sandbox.all(function(data) {
        self.insert(parseInt(data.num, 10), data.markdown);
      });
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
      self.sandbox.all(function(data) {
        $("<div></div>").
          attr("id", "simple" + data.slideId).
          html(markup(data.markdown)).
          appendTo(self.$screen).hide();
      });
      self.sandbox.trigger("loaded.simple");
      self.$screen.children().addClass("slide").first().cell();
    },
    next: function() {
      var $next = this.$screen.children(":visible").hide().next();
      if ($next.length) $next.cell();
      else {
        self.sandbox.trigger("stop.simple").trigger("toggle.simple");
      }
    },
    prev: function() {
      var $prev = this.$screen.children(":visible").hide().prev();
      if ($prev.length) $prev.cell();
      else {
        self.sandbox.trigger("stop.simple").trigger("toggle.simple");
      }
    }
  };
  S.Archive = function() {
    this.db = S.Archive.connection;
  };
  S.Archive[proto] = {
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
        S.Archive.connection = window.localStorage || {};
      }
    }
  };
  S.Archive.connection = window.localStorage || {};

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

  $.fn.cell = function() {
    return this.css({
      'display': 'table-cell',
      'vertical-align': 'middle'
    });
  };

  return $.extend(S, methods);
})({}, jQuery, window);