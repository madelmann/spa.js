#!/bin/bash

echo "Rebuilding translation files for all languages..."

cd lang

for dir in */     # list directories in the form "/tmp/dirname/"
do
    dir=${dir%*/}      # remove the trailing "/"
    echo "Translating language '${dir##*/}'"    # print everything after the final "/"

    slang translate.os --language=${dir%*/}
done

echo "Done."

