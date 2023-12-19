

const username = process.env.MONGO_INITDB_ROOT_USERNAME || 'root';
const password = process.env.MONGO_INITDB_ROOT_PASSWORD || 'example';

console.log('Username:', username);
console.log('Password:', password);

export default {
    "mongo_uri": `mongodb://mongodb:27017/macabi-db`,
    "options": {
        maxPoolSize: 10,
        authSource: "admin",
        user: username,
        pass: password,
        autoCreate: true,
        autoIndex: true,
    }
}