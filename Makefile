#
# Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
#

SHELL := /bin/bash

export NODE_ENV := development

NODE_MODULES := node_modules
NODE_MODULES_BIN := $(NODE_MODULES)/.bin

.PHONY: all
all: bundle

#
# Build client-side JavaScript
#
BUNDLE_JS := public/js/bundle.js

WEBPACK := $(NODE_MODULES_BIN)/webpack-cli
WEBPACK_OPTIONS := --mode $(NODE_ENV)
WEBPACK_CONFIG := webpack.config.js

.PHONY: bundle
bundle: $(BUNDLE_JS)

$(BUNDLE_JS): $(WEBPACK_CONFIG) frontend/main.jsx $(wildcard frontend/app/*.js)
	$(WEBPACK) $(WEBPACK_OPTIONS) || rm -f $@


#
# Unit test
#
TEST_DIR := test
TEST_SUITES_DIR := $(TEST_DIR)/suites

MOCHA := $(NODE_MODULES_BIN)/_mocha
ifeq ($(TEST_TARGETS),)
MOCHA_TARGETS := $(TEST_SUITES_DIR)
else
MOCHA_TARGETS := $(foreach target,$(TEST_TARGETS),$(TEST_SUITES_DIR)/$(target).js)
endif
MOCHA_OPTIONS := --opts $(TEST_DIR)/mocha.opts $(MOCHA_TARGETS)

.PHONY: check
check: clean-data
	$(MOCHA) $(MOCHA_OPTIONS)

#
# Code coverage
#
COVERAGE_DIR := coverage
LCOV_INFO := $(COVERAGE_DIR)/lcov.info

ISTANBUL := $(NODE_MODULES_BIN)/istanbul
ISTANBUL_OPTIONS := --report lcovonly

.PHONY: coverage
coverage: clean-coverage clean-data $(LCOV_INFO)
	genhtml --no-prefix -o $(COVERAGE_DIR) $(LCOV_INFO)

$(LCOV_INFO):
	$(ISTANBUL) cover $(MOCHA) $(ISTANBUL_OPTIONS) -- $(MOCHA_OPTIONS)


#
# Cleanup
#
.PHONY: clean
clean: clean-coverage
	rm -f $(BUNDLE_JS)

.PHONY: clean-coverage
clean-coverage:
	rm -rf $(COVERAGE_DIR)

.PHONY: clean-data
clean-data:
	rm -f data/models.sqlite

