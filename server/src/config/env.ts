
const mongo_host = process.env.MONGO_HOST || 'localhost'
export default {
    "mongo_uri": `mongodb://${mongo_host}:27017/macabi`,
    "mongo_options": {
        maxPoolSize: 10,
        authSource: "admin",
        //user: process.env.MONGO_INITDB_ROOT_USERNAME,
        //pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
        autoCreate: true,
        autoIndex: true,
    }
}