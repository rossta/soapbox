Throwdown = (function(win) {
  var T = function(text) {
    this.text = text;

    this.toHtml = function() {
      var text;

      text = this.send("replaceSpecialCharacters", text);

      text = this.send("padWithNewLines", text);

      text = this.send("replaceTabs", text);

      text = this.send("replaceBlankLines", text);

      text = this.send("headersToHtml", text);

      return text;
    };

    this.send = function() {
      return send.apply(this, arguments);
    };

  },

  proto = "prototype",
  tab = "    ",

  send = function() {
    var args  = Array[proto].slice.call(arguments, 0),
    fnName    = args.shift();
    try {
      return protect[fnName].apply(this, args).process();
    } catch(e) {
      throw "Error while sending '" + fnName + "': " + e.toString();
    }
  },
  protect = {
    replaceSpecialCharacters: function() {
      return new T.Special(arguments[0] || this.text);
    },
    padWithNewLines: function() {
      return new T.Padding(arguments[0] || this.text);
    },
    replaceTabs: function() {
      return new T.Tab(arguments[0] || this.text);
    },
    replaceBlankLines: function() {
      return new T.BlankLine(arguments[0] || this.text);
    },
    headersToHtml: function() {
      return new T.Header(arguments[0] || this.text);
    },
    inlineToHtml: function() {
      return new T.Inline(arguments[0] || this.text);
    }
  };

  T.Special = function(text) {
    this.text = text;
    this.process = function() {
      var text = this.text.
        replace(/~/g,"~T").
        replace(/\$/g,"~D").
        replace(/\r\n/g,"\n").
        replace(/\r/g,"\n");

      return text;
    };
  };

  T.Padding = function(text) {
    this.text = text;
    this.process = function() {
      return "\n\n" + this.text + "\n\n";
    };
  };

  T.BlankLine = function(text) {
    this.text = text;
    this.process = function() {
      return this.text.replace(/^[ \t]+$/mg,"");
    };
  };

  T.Tab = function(text) {
    this.text = text;
    this.process = function() {
      var text = this.text.
        replace(/\t(?=\t)/g, tab).
        replace(/\t/g,"~A~B").
        replace(/~B(.+?)~A/g, function(wholeMatch,m1,m2) {
          var leadingText = m1;
          var numSpaces = 4 - leadingText.length % 4;

          // there *must* be a better way to do this:
          for (var i=0; i<numSpaces; i++) leadingText+=" ";

          return leadingText;
        }).
        replace(/~A/g, tab).
        replace(/~B/g,"");
      return text;
    };
  };

  T.Header = function(text) {
    this.text = text;
    this.process = function() {
      // Setext-style headers:
    	//	Header 1
    	//	========
    	//
    	//	Header 2
    	//	--------
    	//
      // text = text.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,
      //  function(wholeMatch,m1){return hashBlock("<h1>" + _RunSpanGamut(m1) + "</h1>");});
      //
      // text = text.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,
      //  function(matchFound,m1){return hashBlock("<h2>" + _RunSpanGamut(m1) + "</h2>");});
      //
    	// atx-style headers:
    	//  # Header 1
    	//  ## Header 2
    	//  ## Header 2 with closing hashes ##
    	//  ...
    	//  ###### Header 6
    	//

    	/*
    		text = text.replace(/
    			^(\#{1,6})				// $1 = string of #'s
    			[ \t]*
    			(.+?)					// $2 = Header text
    			[ \t]*
    			\#*						// optional closing #'s (not counted)
    			\n+
    		/gm, function() {...});
    	*/

      var text = this.text.
        replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm, function(wholeMatch,m1) {
          return "<h1>" + send.call(this, "inlineToHtml", m1) + "</h1>";
        }).
        replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm, function(matchFound,m1) { 
          return "<h2>" + send.call(this, "inlineToHtml", m1) + "</h2>";
        }).
        replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,
         function(wholeMatch,m1,m2) {
           var h = m1.length;
           return "<h" + h + ">" + send.call(this, "inlineToHtml", m2) + "</h" + h + ">";
         });

      return text;
    };
  };
  
  T.Inline = function(text) {
    this.text = text;
    this.process = function() {
      return this.text;
    };
  }

  win.throwdown = function(text) {
    return new T(text);
  };

  return T;
})(window);