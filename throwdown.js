Throwdown = (function(win) {
  var T = function(text) {
    this.text = text;

    this.toH = function() {
      var text;
      //replaceSpCharacter
      text = this.sn("rSC", text);
      //padWithNewLines
      text = this.sn("pWNL", text);
      //replaceTabs
      text = this.sn("rT", text);
      //replaceBlankLines
      text = this.sn("rBL", text);
      //headersToHtml
      text = this.sn("hTH", text);

      return text;
    };

    this.sn = function() {
      return sn.apply(this, arguments);
    };

  },

  pro = "prototype",
  tab = "    ",

  sn = function() {
    var args  = Array[pro].slice.call(arguments, 0),
    fn    = args.shift();
    try {
      return prt[fn].apply(this, args).process();
    } catch(e) {
      throw "Error '" + fn + "'";
    }
  },
  prt = {
    rSC: function() {
      return new T.Sp(arguments[0] || this.text);
    },
    pWNL: function() {
      return new T.Pd(arguments[0] || this.text);
    },
    rT: function() {
      return new T.Tb(arguments[0] || this.text);
    },
    rBL: function() {
      return new T.Bl(arguments[0] || this.text);
    },
    hTH: function() {
      return new T.Hd(arguments[0] || this.text);
    },
    inTH: function() {
      return new T.In(arguments[0] || this.text);
    }
  };

  T.Sp = function(text) {
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

  T.Pd = function(text) {
    this.text = text;
    this.process = function() {
      return "\n\n" + this.text + "\n\n";
    };
  };

  T.Bl = function(text) {
    this.text = text;
    this.process = function() {
      return this.text.replace(/^[ \t]+$/mg,"");
    };
  };

  T.Tb = function(text) {
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

  T.Hd = function(text) {
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
          return "<h1>" + sn.call(this, "inTH", m1) + "</h1>";
        }).
        replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm, function(matchFound,m1) { 
          return "<h2>" + sn.call(this, "inTH", m1) + "</h2>";
        }).
        replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,
         function(wholeMatch,m1,m2) {
           var h = m1.length;
           return "<h" + h + ">" + sn.call(this, "inTH", m2) + "</h" + h + ">";
         });

      return text;
    };
  };
  
  T.In = function(text) {
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