import mongoose from "mongoose";

export const CONFIG = 'mongodb://Lewis:Pluto!23@ds145346.mlab.com:45346/users';

export const STARTMONGO = () => {
    return(
    mongoose.connect(CONFIG, {
        useNewUrlParser: true
    }).then(() => console.log('Successfully connected'))
        .catch(() => console.log('Error occurred'))
);
}