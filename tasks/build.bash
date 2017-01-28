#!/usr/bin/env bash

[ -e dist.html ] && rm dist.html

echo "Minifying with Closure Compiler..."

minified=$(./node_modules/.bin/google-closure-compiler-js \
    --compilationLevel ADVANCED \
    src/index.js)

# interestingly, invoking ./node_modules/.bin/regpack
# results in ': No such file or directory'. I can't
# find the cause of this, so I'm explicitly running
# it through Node.js
echo "Crushing minified output with RegPack..."
crushed=$(echo $minified | node ./node_modules/.bin/regpack -)

echo "Injecting crushed script into index.html"
sed "s/###DEMOTARGET###/$crushed/" src/index.html > dist.html

echo "Done!"