import { mongoose } from 'mongoose';


const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB);
        // , {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        //     useCreateIndex: true,
        //     useFindAndModify: false
        // }
        console.log('Connected to bd cafe');
    } catch (err) {
        console.error(err);
        throw new Error('Could not connect to MongoDB');
    }
}

export {
    dbConnection
};
