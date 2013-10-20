
test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter nyan \
		--bail \
		test/* \
		test/plugins/*

.PHONY: test