Simple=(function(i,d,g){d.fn.dl=d.fn.delegate;d.fn.tr=d.fn.trigger;d.fn.nx=d.fn.next;d.fn.pv=d.fn.prev;d.fn.tg=d.fn.toggle;var c=i,h="prototype",f=document,e="<a href='#'></a>",b={init:function(){var j=new c.Sx();j.add(c.Au).add(c.Sw).add(c.We).add(c.Ky).init();Simple.app=j;return j}},a=function(j){return throwdown(j).toH()};c.Sx=function(){this.ms=[]};c.Sx[h]={add:function(k){var j=new k();j.sx=this;this.ms.push(j);return this},init:function(){var j=this;j.arc=new c.Archive();j.ech("init");d("a.tg").bind("click",function(){j.ech("tg")});j.bind("tg.smp",function(){j.ech("tg")});return j},tr:function(j,k){return d(f).tr(j,k)},bind:function(j,k){return d(f).bind(j,k)},ech:function(j){d.map(this.ms,function(k){if(typeof k[j]=="function"){k[j]()}})},lo:function(j){j=j||"demo";var m=this,l=m.rt(j),n=m.rt("spb");if(!l){l=[];if(j=="demo"){l=["# Create sls","with text","<h2>html</h2>","# and (some) markdown","# Any questions?"]}}if(!n){n=[j]}if(d.inArray(j,n)<0){n.push(j)}m.store("spb",n);m.k=j;m.s=l;return l},rt:function(j){return this.arc.rt(j)},get:function(j){return this.s[j]},save:function(l,k){var j=this;j.s[l]=k;return j.store(j.k,j.s)},store:function(j,l){return this.arc.store(j,l)},all:function(k){var m=this,l=0,j=m.s[l];while(j){k({num:l,mk:j});j=m.s[++l]}return m},clear:function(){return this.arc.clear()}};c.Au=function(k){k=k||"#au";var j=this;j.sel=k;j.$sel=d(k);j.$pre=j.$sel.find("#pre");j.$ta=j.$sel.find("textarea");j.$pgs=j.$sel.find("#pgs")};c.Au[h]={init:function(){var j=this;j.hide();j.listen()},listen:function(){var j=this;j.$sel.dl("textarea","keyup change",function(){var l=d(this),k=l.val();slId=l.attr("name");d("#"+slId).html(a(k));j.sx.save(slId.split("_")[1],k)}).dl("#pre","click",function(){d(this).nx().find("textarea").focus()}).dl("a.pl","click",function(){j.sx.tr("pl.smp");return false}).dl("a.ins","click",function(){j.ins(j.$pre.children().length,"# New Slide");return false}).dl("a.nw","click",function(){j.createNew();return false}).dl("#pgs a","click",function(){j.dp(parseInt(d(this).html(),10)-1);return false}).dl(".hm","click",function(){return g.location.reload()});j.sx.bind("nw.smp",function(){j.createNew()}).bind("edit.smp",function(){j.lo(j.sx.k)})},hide:function(){return this.$sel.hide()},show:function(){return this.$sel.show()},createNew:function(){var j=this,k=prompt("Save New Slideshow As...");j.lo(k);j.$pre.empty();j.$pgs.empty();j.ins(0,"# New Slideshow");j.show()},dp:function(j,m){var k=this,l="sl_"+j;m=m||k.sx.get(j);d("div.sl").hide();d("[id$="+l+"]").show();k.$pgs.children().removeClass("cur").filter(":eq("+j+")").addClass("cur");k.$ta.attr("name",l).val(m);k.$ta.change();return k},ins:function(j,l){var k=this;d("<div></div>").attr("id","sl_"+j).attr("class","sl ca pdg").html(a(l)).appendTo(k.$pre).hide();d(e).html(j+1).appendTo(k.$pgs);k.sx.save(j,l);k.dp(j);return k},tg:function(){return this.$sel.tg()},lo:function(j){var l=this;l.sx.lo(j);l.sx.all(function(k){l.ins(parseInt(k.num,10),k.mk)});l.dp(0)}};c.Sw=function(k){k=k||"#sw";var j=this;j.sel=k;j.$sel=d(k);j.$sc=j.$sel.find(".sc");j.$ex=j.$sel.find(".ex")};c.Sw[h]={init:function(){var j=this;j.hide();j.listen()},listen:function(){var j=this;j.$sel.dl("a.ex","click",function(){j.sx.tr("stop.smp")});j.sx.bind("pl.smp",function(){j.pl()}).bind("loed.smp",function(l,k){j.show()}).bind("nx.smp",function(){j.nx()}).bind("pv.smp",function(){j.pv()})},hide:function(){this.$ex.hide();return this.$sel.hide()},show:function(){this.$ex.show();return this.$sel.show()},tg:function(){this.$ex.tg();return this.$sel.tg()},pl:function(){var j=this;j.$sc.empty();j.sx.all(function(k){d("<div></div>").html(a(k.mk)).appendTo(j.$sc).hide()});j.$sc.children().addClass("sl").first().cl();j.sx.tr("loed.smp")},nx:function(){var j=this,k=j.$sc.children(":visible").hide().nx();if(k.length){k.cl()}else{j.sx.tr("stop.smp").tr("tg.smp")}},pv:function(){var j=this,k=j.$sc.children(":visible").hide().pv();if(k.length){k.cl()}else{j.sx.tr("stop.smp").tr("tg.smp")}}};c.We=function(k){k=k||"#we";var j=this;j.sel=k;j.$sel=d(k);j.$sc=j.$sel.find(".sc");j.spb=[]};c.We[h]={init:function(){var j=this;j.show();j.$sel.dl("a.pl","click",function(){j.sx.lo(d(this).text());j.hide();j.sx.tr("edit.smp").tr("pl.smp")})},hide:function(){return this.$sel.hide()},show:function(){var j=this;j.sx.lo();j.spb=j.sx.rt("spb");d.map(j.spb,function(k){d(e).html(k).addClass("pl").appendTo(j.$sc)});d("<hr />").appendTo(j.$sc);d(e).html("new").appendTo(j.$sc).click(function(){j.sx.tr("nw.smp");j.hide()});return j.$sel.show()}};c.Archive=function(){this.db=c.Archive.connection};c.Archive[h]={rt:function(j){var l=this.db[j];if(l){return JSON.parse(l)}else{return null}},store:function(j,l){this.db[j]=JSON.stringify(l);return this},clear:function(){try{this.db.clear()}catch(j){c.Archive.connection=g.localStorage||{}}}};c.Archive.connection=g.localStorage||{};c.Ky=function(){var j=this;j.EDIT="edit";j.SHOW="show";j.cxt=j.EDIT};c.Ky[h]={ks:{space:32,left:37,right:39,esc:27},init:function(){var j=this,k=j.ks;j.sx.bind("pl.smp",function(){j.cxt=j.SHOW}).bind("stop.smp",function(){j.cxt=j.EDIT}).bind("keydown",function(m){var l=m.keyCode;switch(j.cxt){case j.SHOW:switch(l){case k.left:j.sx.tr("pv.smp");break;case k.right:j.sx.tr("nx.smp");break;case k.esc:j.sx.tr("stop.smp");j.sx.tr("tg.smp");break;default:break}break}})}};d.fn.cl=function(){return this.css({display:"table-cell","vertical-align":"middle"})};return d.extend(c,b)})({},jQuery,window);