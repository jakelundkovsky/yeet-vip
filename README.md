# yeet-vip

MVP Yeet Admin Dashboard Take-Home

## Running the project
- clone the repo `git clone git@github.com:jakelundkovsky/yeet-vip.git`
- cd into the repo `cd yeet-vip`
- install backend dependencies `cd backend && npm i && cd ..`
- install frontend dependencies `cd frontend && npm i && cd ..`
- stand docker/db up `cd backend && docker-compose up -d`
  - note, if you're experience issues like "no user with role postgres ... you might need to kill redundant processes `sudo lsof -i :5432` -> `sudo kill [pid]`"
- run migrations `npm run migrations:run`
- seed db `npm run seed:db`

- run backend `cd backend && npm run dev`
- in new terminal, run frontend `cd frontend && npm run dev`

### DB Considerations
- choice of db
  - postgres
- ORM
  - typeORM
- future
  - current tables
    - users
    - transactions
  - future tables
    - action logs


### API Considerations

### Frontend Considerations