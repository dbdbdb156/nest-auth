db = db.getSiblingDB('myapp'); // 생성할 앱용 DB

db.createUser({
  user: 'appuser',
  pwd: 'apppass',
  roles: [
    {
      role: 'readWrite',
      db: 'myapp',
    },
  ],
});
