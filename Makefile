#!make
.DEFAULT_GOAL := build

NAME = discord-gamedeals-bot
TAGNAME = halkeye/$(NAME)
VERSION = latest

build: ## Build docker image
	docker build -t $(TAGNAME):$(VERSION) .

push: ## push to docker hub
	docker push $(TAGNAME):$(VERSION)

.SHELL := /bin/bash
run: ## run the docker hub
	docker run -it --rm \
		--name $(NAME) \
		-e PORT=3000 \
		-p 3000:3000 \
		$(TAGNAME):$(VERSION)

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
