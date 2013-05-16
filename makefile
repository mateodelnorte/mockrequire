test: 
	-DEBUG= NODE_ENV=development ./node_modules/mocha/bin/mocha -R spec

test-debug: 
	-DEBUG=mockrequire* NODE_ENV=development ./node_modules/mocha/bin/mocha -R spec

test-docs:
	-DEBUG=mockrequire* NODE_ENV=development ./node_modules/.bin/mocha -R doc -t 5000 > docs/docs.html

test-markdown:
	-DEBUG=mockrequire* NODE_ENV=development ./node_modules/.bin/mocha -R markdown -t 5000 > docs/docs.md
.PHONY: test
