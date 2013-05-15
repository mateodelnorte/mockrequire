test: 
	-DEBUG= NODE_ENV=development ./node_modules/mocha/bin/mocha -R spec

test-debug: 
	-DEBUG=mockrequire* NODE_ENV=development ./node_modules/mocha/bin/mocha -R spec

.PHONY: test
