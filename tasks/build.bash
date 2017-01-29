#!/usr/bin/env bash

function echo_byte_length {
    local type=$1
    local byte_length=$2

    echo "$type output length: $byte_length byte(s)"
}

[ -e dist.html ] && rm dist.html

echo "Minifying with Closure Compiler..."

minified=$(./node_modules/.bin/google-closure-compiler-js \
    --compilationLevel ADVANCED \
    src/index.js)

minified_byte_length=$(echo $minified | wc --bytes)
echo_byte_length "Minified" $minified_byte_length

# interestingly, invoking ./node_modules/.bin/regpack
# results in ': No such file or directory'. I can't
# find the cause of this, so I'm explicitly running
# it through Node.js
echo "Crushing minified output with RegPack..."
crushed=$(echo $minified | node ./node_modules/.bin/regpack -)
crushed_byte_length=$(echo $crushed | wc --bytes)
echo_byte_length "Crushed" $crushed_byte_length

echo "Injecting crushed script into index.html"
sed "s/###DEMOTARGET###/$crushed/" src/index.html > dist.html

./tasks/dump_size_data.bash $minified_byte_length $crushed_byte_length

echo "Done!"