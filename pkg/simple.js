Simple=(function(i,e,g){e.fn.dl=e.fn.delegate;e.fn.tr=e.fn.trigger;e.fn.nx=e.fn.next;e.fn.pv=e.fn.prev;e.fn.tg=e.fn.toggle;var d=i,h="prototype",f=document,b={init:function(){var j=new d.Sx();j.add(d.Au).add(d.Sw).add(d.We).add(d.Ky).init();Simple.app=j;return j}},c=function(){if(g.console&&g.console.log&&typeof g.console.log.apply=="function"){g.console.log.apply(g.console,arguments)}},a=function(j){return throwdown(j).toH()};d.Sx=function(){this.ms=[]};d.Sx[h]={add:function(k){var j=new k();j.sx=this;this.ms.push(j);return this},init:function(){var j=this;j.archive=new d.Archive();j.forEach("init");e("a.tg").bind("click",function(){j.forEach("tg")});j.bind("tg.smp",function(){j.forEach("tg")});return j},tr:function(j,k){return e(f).tr(j,k)},bind:function(j,k){return e(f).bind(j,k)},forEach:function(j){e.map(this.ms,function(k){if(typeof k[j]=="function"){k[j]()}})},load:function(j){j=j||"demo";var m=this,n=m.rt(j),l=m.rt("soapboxes");if(!n){n=[];if(j=="demo"){n=["# Create slides","with text","<h2>html</h2>","# and (some) markdown","# Any questions?"]}}if(!l){l=[j]}if(e.inArray(j,l)<0){l.push(j)}m.store("soapboxes",l);m.k=j;m.s=n;return n},rt:function(j){return this.archive.rt(j)},get:function(j){return this.s[j]},save:function(l,k){c("Saving",l,k);var j=this;j.s[l]=k;return j.store(j.k,j.s)},store:function(j,l){return this.archive.store(j,l)},all:function(m){var l=this,k=0,j=l.s[k];while(j){m({num:k,mk:j});j=l.s[++k]}return l},clear:function(){return this.archive.clear()}};d.Au=function(k){k=k||"#au";var j=this;j.sel=k;j.$sel=e(k);j.$pre=j.$sel.find("#pre");j.$ta=j.$sel.find("textarea");j.$pgs=j.$sel.find("#pgs")};d.Au[h]={init:function(){var j=this;j.hide();j.listen()},listen:function(){var j=this;j.$sel.dl("textarea","keyup change",function(){var l=e(this),k=l.val();slideId=l.attr("name");e("#"+slideId).html(a(k));j.sx.save(slideId.split("_")[1],k)}).dl("#pre","click",function(){e(this).nx().find("textarea").focus()}).dl("a.pl","click",function(){j.sx.tr("pl.smp");return false}).dl("a.ins","click",function(){j.ins(j.$pre.children().length,"# New Slide");return false}).dl("a.new","click",function(){j.createNew();return false}).dl("#pgs a","click",function(){j.display(parseInt(e(this).html(),10)-1);return false}).dl(".home","click",function(){return g.location.reload()});j.sx.bind("new.smp",function(){j.createNew()}).bind("edit.smp",function(){j.load(j.sx.k)})},hide:function(){return this.$sel.hide()},show:function(){return this.$sel.show()},createNew:function(){var j=this,k=prompt("Save New Slideshow As...");j.load(k);j.$pre.empty();j.$pgs.empty();j.ins(0,"# New Slideshow");j.show()},display:function(j,m){var l=this,k="slide_"+j;m=m||l.sx.get(j);e("div.slide").hide();e("[id$="+k+"]").show();l.$pgs.children().removeClass("current").filter(":eq("+j+")").addClass("current");l.$ta.attr("name",k).val(m);l.$ta.change();return l},ins:function(j,l){var k=this;e("<div></div>").attr("id","slide_"+j).attr("class","slide card padding").html(a(l)).appendTo(k.$pre).hide();e("<a href='#'></a>").html(j+1).appendTo(k.$pgs);k.sx.save(j,l);k.display(j);return k},tg:function(){return this.$sel.tg()},load:function(j){var l=this;l.sx.load(j);l.sx.all(function(k){l.ins(parseInt(k.num,10),k.mk)});l.display(0)}};d.Sw=function(k){k=k||"#sw";var j=this;j.sel=k;j.$sel=e(k);j.$screen=j.$sel.find(".screen");j.$exit=j.$sel.find(".exit")};d.Sw[h]={init:function(){var j=this;j.hide();j.listen()},listen:function(){var j=this;j.$sel.dl("a.exit","click",function(){j.sx.tr("stop.smp")});j.sx.bind("pl.smp",function(){j.pl()}).bind("loaded.smp",function(l,k){j.show()}).bind("nx.smp",function(){j.nx()}).bind("pv.smp",function(){j.pv()})},hide:function(){this.$exit.hide();return this.$sel.hide()},show:function(){this.$exit.show();return this.$sel.show()},tg:function(){this.$exit.tg();return this.$sel.tg()},pl:function(){var j=this;j.$screen.empty();j.sx.all(function(k){e("<div></div>").attr("id","simple"+k.slideId).html(a(k.mk)).appendTo(j.$screen).hide()});j.$screen.children().addClass("slide").first().cell();j.sx.tr("loaded.smp")},nx:function(){var j=this,k=j.$screen.children(":visible").hide().nx();if(k.length){k.cell()}else{j.sx.tr("stop.smp").tr("tg.smp")}},pv:function(){var j=this,k=j.$screen.children(":visible").hide().pv();if(k.length){k.cell()}else{j.sx.tr("stop.smp").tr("tg.smp")}}};d.We=function(k){k=k||"#welcome";var j=this;j.sel=k;j.$sel=e(k);j.$screen=j.$sel.find(".screen");j.soapboxes=[]};d.We[h]={init:function(){var j=this;j.show();j.$sel.dl("a.pl","click",function(){j.sx.load(e(this).text());j.hide();j.sx.tr("edit.smp").tr("pl.smp")})},hide:function(){return this.$sel.hide()},show:function(){var j=this;j.sx.load();j.soapboxes=j.sx.rt("soapboxes");e.map(j.soapboxes,function(k){e("<a href='#'></a>").html(k).addClass("pl").appendTo(j.$screen)});e("<hr />").appendTo(j.$screen);e("<a href='#'></a>").html("new").appendTo(j.$screen).click(function(){j.sx.tr("new.smp");j.hide()});return j.$sel.show()}};d.Archive=function(){this.db=d.Archive.connection};d.Archive[h]={rt:function(j){var l=this.db[j];if(l){return JSON.parse(l)}else{return null}},store:function(j,l){this.db[j]=JSON.stringify(l);return this},clear:function(){try{this.db.clear()}catch(j){d.Archive.connection=g.localStorage||{}}}};d.Archive.connection=g.localStorage||{};d.Ky=function(){var j=this;j.EDIT="edit";j.SHOW="show";j.context=j.EDIT};d.Ky[h]={ks:{space:32,left:37,right:39,esc:27},init:function(){var j=this,k=j.ks;j.sx.bind("pl.smp",function(){j.context=j.SHOW}).bind("stop.smp",function(){j.context=j.EDIT}).bind("keydown",function(m){var l=m.keyCode;switch(j.context){case j.EDIT:c(l);break;case j.SHOW:switch(l){case k.space:c("space");break;case k.left:j.sx.tr("pv.smp");break;case k.right:j.sx.tr("nx.smp");break;case k.esc:j.sx.tr("stop.smp");j.sx.tr("tg.smp");break;default:c(l);break}break}})}};e.fn.cell=function(){return this.css({display:"table-cell","vertical-align":"middle"})};return e.extend(d,b)})({},jQuery,window);