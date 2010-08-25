Throwdown = (function(win) {
  var T = function(x) {
    this.x = x;

    this.toH = function() {
      var x;
      //replaceSpCharacter
      x = this.sn("rSC", x);
      //padWithNewLines
      x = this.sn("pWNL", x);
      //replaceTabs
      x = this.sn("rT", x);
      //replaceBlankLines
      x = this.sn("rBL", x);
      //headersToHtml
      x = this.sn("hTH", x);

      return x;
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
      return new T.Sp(arguments[0] || this.x);
    },
    pWNL: function() {
      return new T.Pd(arguments[0] || this.x);
    },
    rT: function() {
      return new T.Tb(arguments[0] || this.x);
    },
    rBL: function() {
      return new T.Bl(arguments[0] || this.x);
    },
    hTH: function() {
      return new T.Hd(arguments[0] || this.x);
    },
    inTH: function() {
      return new T.In(arguments[0] || this.x);
    }
  };

  T.Sp = function(x) {
    this.x = x;
    this.process = function() {
      var x = this.x.
        replace(/~/g,"~T").
        replace(/\$/g,"~D").
        replace(/\r\n/g,"\n").
        replace(/\r/g,"\n");

      return x;
    };
  };

  T.Pd = function(x) {
    this.x = x;
    this.process = function() {
      return "\n\n" + this.x + "\n\n";
    };
  };

  T.Bl = function(x) {
    this.x = x;
    this.process = function() {
      return this.x.replace(/^[ \t]+$/mg,"");
    };
  };

  T.Tb = function(x) {
    this.x = x;
    this.process = function() {
      var x = this.x.
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
      return x;
    };
  };

  T.Hd = function(x) {
    this.x = x;
    this.process = function() {
      // Sex-style headers:
    	//	Header 1
    	//	========
    	//
    	//	Header 2
    	//	--------
    	//
      // x = x.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,
      //  function(wholeMatch,m1){return hashBlock("<h1>" + _RunSpanGamut(m1) + "</h1>");});
      //
      // x = x.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,
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
    		x = x.replace(/
    			^(\#{1,6})				// $1 = string of #'s
    			[ \t]*
    			(.+?)					// $2 = Header x
    			[ \t]*
    			\#*						// optional closing #'s (not counted)
    			\n+
    		/gm, function() {...});
    	*/

      var x = this.x.
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

      return x;
    };
  };
  
  T.In = function(x) {
    this.x = x;
    this.process = function() {
      return this.x;
    };
  }

  win.throwdown = function(x) {
    return new T(x);
  };

  return T;
})(window);