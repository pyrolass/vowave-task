.DEFAULT_GOAL := run

.PHONY: docker-compose migrate

docker:
	docker-compose up -d

migrate:
	yarn prisma migrate dev  
	
run:
	yarn run start:dev