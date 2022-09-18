import mongoose from "mongoose";

export const CONFIG = 'mongodb://';

export const STARTMONGO = () => {
    return(
    mongoose.connect(CONFIG, {
        useNewUrlParser: true
    }).then(() => console.log('Successfully connected'))
        .catch(() => console.log('Error occurred'))
);
}
