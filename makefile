test: 
	-export NODE_ENV=development; \
	./node_modules/mocha/bin/mocha -R spec ./test/handler-test.js;

.PHONY: test