.PHONY: base
base:
	docker build -t pacem -f Dockerfile.base .

.PHONY: backend
backend:
	docker build -t pacem-backend -f apps/backend/Dockerfile.backend .