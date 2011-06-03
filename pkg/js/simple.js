Simple=(function(i,d,e){var c=i,g="prototype",f=document,a={init:function(){var l,j,k;sandbox=new c.Sandbox();sandbox.add(c.Author).add(c.Slideshow).add(c.Welcome).add(c.KeyListener).init();Simple.app=sandbox;return sandbox}},b=function(){var j=e.console;if(j&&j.log&&typeof j.log.apply=="function"){j.log.apply(j,arguments)}},h=function(j){return throwdown(j).toH()};c.Sandbox=function(){this.modules=[]};c.Sandbox[g]={add:function(j){var k=this,l=new j();l.sandbox=this;k.modules.push(l);return k},init:function(){var j=this;j.archive=new c.Archive();j.forEach("init");d("a.toggle").bind("click",function(){j.forEach("toggle")});j.bind("toggle.simple",function(){j.forEach("toggle")})},trigger:function(j,k){return d(f).trigger(j,k)},bind:function(j,k){return d(f).bind(j,k)},forEach:function(j){d.map(this.modules,function(k){if(typeof k[j]=="function"){k[j]()}})},load:function(l){l=l||"demo";var j=this,m=j.retrieve(l),k=j.retrieve("soapboxes");if(!m){m=[];if(l=="demo"){m=["# Create slides","with text","<h2>html</h2>","# and (some) markdown","# Any questions?"]}}if(!k){k=[l]}if(d.inArray(l,k)<0){k.push(l)}j.store("soapboxes",k);j.key=l;j.slides=m;return m},retrieve:function(j){return this.archive.retrieve(j)},get:function(j){return this.slides[j]},save:function(l,k){b("Saving",l,k);var j=this;j.slides[l]=k;return j.store(j.key,j.slides)},store:function(j,k){return this.archive.store(j,k)},all:function(m){var j=this,k=0,l=j.slides[k];while(l){m({num:k,markdown:l});l=j.slides[++k]}return j},clear:function(){return this.archive.clear()}};c.Author=function(j){var k=this;j=j||"#author";k.selector=j;k.$selector=d(j);k.$preview=k.$selector.find("#preview");k.$textarea=k.$selector.find("textarea");k.$pages=k.$selector.find("#pages")};c.Author[g]={init:function(){this.hide();this.listen()},listen:function(){var j=this,k=j.sandbox;j.$selector.delegate("textarea","keyup change",function(){var m=d(this),l=m.val();slideId=m.attr("name");d("#"+slideId).html(h(l));k.save(slideId.split("_")[1],l)}).delegate("#preview","click",function(){d(this).next().find("textarea").focus()}).delegate("a.play","click",function(){k.trigger("play.simple");return false}).delegate("a.insert","click",function(){j.insert(j.$preview.children().length,"# New Slide");return false}).delegate("a.new","click",function(){j.createNew();return false}).delegate("#pages a","click",function(){j.display(parseInt(d(this).html(),10)-1);return false}).delegate(".home","click",function(){return e.location.reload()});k.bind("new.simple",function(){j.createNew()}).bind("edit.simple",function(){j.load(k.key)});return j},hide:function(){return this.$selector.hide()},show:function(){return this.$selector.show()},createNew:function(){var j=this,k=prompt("Save New Slideshow As...");j.load(k);j.$preview.empty();j.$pages.empty();j.insert(0,"# New Slideshow");j.show();return j},display:function(k,m){var j=this,l="slide_"+k,n=j.sandbox;m=m||n.get(k);d("div.slide").hide();d("[id$="+l+"]").show();j.$pages.children().removeClass("current").filter(":eq("+k+")").addClass("current");j.$textarea.attr("name",l).val(m);j.$textarea.change();return j},insert:function(k,l){var j=this,m=j.sandbox;d("<div></div>").attr("id","slide_"+k).attr("class","slide card padding").html(h(l)).appendTo(j.$preview).hide();d("<a href='#'></a>").html(k+1).appendTo(j.$pages);m.save(k,l);j.display(k);return j},toggle:function(){return this.$selector.toggle()},load:function(k){var j=this,l=j.sandbox;l.load(k);l.all(function(m){j.insert(parseInt(m.num,10),m.markdown)});j.display(0)}};c.Slideshow=function(j){var k=this;j=j||"#slideshow";k.selector=j;k.$selector=d(j);k.$screen=k.$selector.find(".screen");k.$exit=k.$selector.find(".exit")};c.Slideshow[g]={init:function(){this.hide();this.listen()},listen:function(){var j=this,k=j.sandbox;j.$selector.delegate("a.exit","click",function(){k.trigger("stop.simple")});k.bind("play.simple",function(){j.play()}).bind("loaded.simple",function(m,l){j.show()}).bind("next.simple",function(){j.next()}).bind("prev.simple",function(){j.prev()});return j},hide:function(){var j=this;j.$exit.hide();return j.$selector.hide()},show:function(){var j=this;j.$exit.show();return j.$selector.show()},toggle:function(){var j=this;j.$exit.toggle();return j.$selector.toggle()},play:function(){var j=this,k=j.sandbox;j.$screen.empty();k.all(function(l){d("<div></div>").attr("id","simple"+l.slideId).html(h(l.markdown)).appendTo(j.$screen).hide()});j.$screen.children().addClass("slide").first().cell();k.trigger("loaded.simple")},next:function(){var k=this,l=k.sandbox,j=k.$screen.children(":visible").hide().next();if(j.length){j.cell()}else{l.trigger("stop.simple").trigger("toggle.simple")}},prev:function(){var k=this,l=k.sandbox,j=k.$screen.children(":visible").hide().prev();if(j.length){j.cell()}else{l.trigger("stop.simple").trigger("toggle.simple")}}};c.Welcome=function(j){var k=this;j=j||"#welcome";k.selector=j;k.$selector=d(j);k.$screen=k.$selector.find(".screen");k.soapboxes=[]};c.Welcome[g]={init:function(){var j=this,k=j.sandbox;j.show();j.$selector.delegate("a.play","click",function(){k.load(d(this).text());j.hide();k.trigger("edit.simple").trigger("play.simple")})},hide:function(){return this.$selector.hide()},show:function(){var j=this,k=j.sandbox;k.load();j.soapboxes=k.retrieve("soapboxes");d.map(j.soapboxes,function(l){d("<a href='#'></a>").html(l).addClass("play").appendTo(j.$screen)});d("<hr />").appendTo(j.$screen);d("<a href='#'></a>").html("new").appendTo(j.$screen).click(function(){k.trigger("new.simple");j.hide()});return j.$selector.show()}};c.Archive=function(){this.db=c.Archive.connection};c.Archive[g]={retrieve:function(j){var k=this.db[j];if(k){return JSON.parse(k)}else{return null}},store:function(k,l){var j=this;j.db[k]=JSON.stringify(l);return j},clear:function(){try{this.db.clear()}catch(j){c.Archive.connection=e.localStorage||{}}}};c.Archive.connection=e.localStorage||{};c.KeyListener=function(){var j=this;j.EDIT="edit";j.SHOW="show";j.context=j.EDIT};c.KeyListener[g]={keys:{space:32,left:37,right:39,esc:27},init:function(){var j=this,l=j.sandbox,k=j.keys;l.bind("play.simple",function(){j.context=j.SHOW}).bind("stop.simple",function(){j.context=j.EDIT}).bind("keydown",function(n){var m=n.keyCode;switch(j.context){case j.EDIT:switch(m){case k.left:l.trigger("prev.simple");break;case k.right:l.trigger("next.simple");break;default:b(m);break}case j.SHOW:switch(m){case k.space:b("space");break;case k.left:l.trigger("prev.simple");break;case k.right:l.trigger("next.simple");break;case k.esc:l.trigger("stop.simple");l.trigger("toggle.simple");break;default:b(m);break}break}})}};d.fn.cell=function(){return this.css({display:"table-cell","vertical-align":"middle"})};return d.extend(c,a)})({},jQuery,window);