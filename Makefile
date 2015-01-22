
test:
	@./node_modules/.bin/mocha \
		--require should \
		--bail \
		test/* \
		test/plugins/*

.PHONY: test
