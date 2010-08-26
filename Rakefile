namespace :soapbox do
  
  task :pkg do
    dir = "pkg"
    `java -jar /usr/local/bin/yuicompressor -o pkg/css/simple.css css/simple.css`
    `java -jar /usr/local/bin/yuicompressor -o pkg/js/simple.js js/simple.js`
    `java -jar /usr/local/bin/yuicompressor -o pkg/js/throwdown.js js/throwdown.js`
    `java -jar /usr/local/bin/htmlcompressor -o pkg/index.html index.html`
    system "zip -r soapbox.zip pkg/*"
  end
end