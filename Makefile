
test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter spec \
		--bail \
		test/* \
		test/plugins/*

.PHONY: test