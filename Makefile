all: jsdoc compile

jsdoc:
	bash ./tools/generate_jsdoc.sh

compile:
	bash ./tools/compile_js.sh
	ls -lh khtml*.js
	
build: jsdoc compile
	rm -rf build/img
	rm -rf build/css
	cp -R css img build/
	cp khtml_*.js build/