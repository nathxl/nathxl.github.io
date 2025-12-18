npm init -y

npm install @11ty/eleventy

rm -rf _site && npx @11ty/eleventy

rm -rf _site && npx @11ty/eleventy --watch

rm -rf _site && npx @11ty/eleventy --serve

ffmpeg -i input.avi -c:v libtheora -q:v 7 -c:a libvorbis -q:a 4 output.ogv

