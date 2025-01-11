#  Connect to the database
docker-compose exec postgres psql -U carventory_user -d carventory_db


#  execute the seed
npx ts-node src/seed.ts
