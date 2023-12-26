const mongoose = require('mongoose');

const dbConfig = async(mongo_url)=>{
    try {
        await mongoose.connect(`${mongo_url}`);
        console.log("Database connected successfully");
    } catch (error) {
        console.log(`Error at db.config dbConfig ${error}`)
    }
}


module.exports = {dbConfig}
