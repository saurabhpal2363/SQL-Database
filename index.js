const { faker } = require('@faker-js/faker');

let getRandomUser = () => {
  return {
    idd: faker.string.uuid(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password()
  };
}


console.log(getRandomUser());