const axios = require('axios');
const instance = axios.create({ baseURL: "http://localhost:8080/LearnSpaceBackend/api/" });
console.log(instance.getUri({ url: "/courses/136" }));
