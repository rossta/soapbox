namespace :soapbox do
  
  task :pkg do
    dir = "pkg"
    `java -jar /usr/local/bin/yuicompressor -o pkg/simple.css simple.css`
    `java -jar /usr/local/bin/yuicompressor -o pkg/simple.js simple.js throwdown.js`
    `java -jar /usr/local/bin/yuicompressor -o pkg/throwdown.js throwdown.js`
    `java -jar /usr/local/bin/htmlcompressor -o pkg/index.html index.html`
  end
end