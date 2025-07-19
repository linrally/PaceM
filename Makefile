.PHONY: base
base:
	docker build -t pacem:latest -f Dockerfile .
