#!/bin/sh

# Build TypeScript code
npm run build

# Start MySQL client
mysql -u $MYSQL_USER -p$MYSQL_ROOT_PASSWORD -h $MYSQL_HOST -P $MYSQL_PORT -e "source init_mysql.sql"


until nc -z -v -w30 database 3306
do
  echo "Waiting for MySQL server to start..."
  sleep 5
done

# Run Prisma migrations
npx prisma migrate dev

# Start your application
npm start
