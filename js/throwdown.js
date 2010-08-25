Throwdown = (function(win) {
  var T = function(x) {
    String.prototype.rp = String.prototype.replace;
    var s = this;
    s.x = x;

    s.toH = function() {
      var t = this, x;
      //replaceSpCharacter
      x = t.sn("rSC", x);
      //padWithNewLines
      x = t.sn("pWNL", x);
      //replaceTabs
      x = t.sn("rT", x);
      //replaceBlankLines
      x = t.sn("rBL", x);
      //headersToHtml
      x = t.sn("hTH", x);

      return x;
    };

    s.sn = function() {
      return sn.apply(s, arguments);
    };

  },

  pro = "prototype",
  tab = "    ",

  sn = function() {
    var args  = Array[pro].slice.call(arguments, 0),
    fn    = args.shift();
    try {
      return prt[fn].apply(this, args).p();
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
    this.p = function() {
      var x = this.x.
        rp(/~/g,"~T").
        rp(/\$/g,"~D").
        rp(/\r\n/g,"\n").
        rp(/\r/g,"\n");

      return x;
    };
  };

  T.Pd = function(x) {
    this.x = x;
    this.p = function() {
      return "\n\n" + this.x + "\n\n";
    };
  };

  T.Bl = function(x) {
    this.x = x;
    this.p = function() {
      return this.x.rp(/^[ \t]+$/mg,"");
    };
  };

  T.Tb = function(x) {
    this.x = x;
    this.p = function() {
      var x = this.x.
        rp(/\t(?=\t)/g, tab).
        rp(/\t/g,"~A~B").
        rp(/~B(.+?)~A/g, function(wM,m1,m2) {
          var lT = m1;
          var numSpaces = 4 - lT.length % 4;

          // there *must* be a better way to do this:
          for (var i=0; i<numSpaces; i++) lT+=" ";

          return lT;
        }).
        rp(/~A/g, tab).
        rp(/~B/g,"");
      return x;
    };
  };

  T.Hd = function(x) {
    this.x = x;
    this.p = function() {
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
        rp(/^(.+)[ \t]*\n=+[ \t]*\n+/gm, function(wM,m1) {
          return "<h1>" + sn.call(this, "inTH", m1) + "</h1>";
        }).
        rp(/^(.+)[ \t]*\n-+[ \t]*\n+/gm, function(mF,m1) { 
          return "<h2>" + sn.call(this, "inTH", m1) + "</h2>";
        }).
        rp(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,
         function(wM,m1,m2) {
           var h = m1.length;
           return "<h" + h + ">" + sn.call(this, "inTH", m2) + "</h" + h + ">";
         });

      return x;
    };
  };
  
  T.In = function(x) {
    this.x = x;
    this.p = function() {
      return this.x;
    };
  };

  win.throwdown = function(x) {
    return new T(x);
  };

  return T;
})(window);