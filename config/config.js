require('dotenv').config()
global.express = require('express')
global.cors = require("cors")
global.mongoose = require("mongoose")
// global.axios = require('axios').default;
global.GLOBAL_VALUE = process.env
global.Schema = mongoose.Schema
global.bcrypt = require("bcrypt");

//--------------- Connect to Mongo ---------------//
const mongo_uri = GLOBAL_VALUE.MG_CONNECT
console.log(mongo_uri)
mongoose.connect(mongo_uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(() => {
    console.log("[success] task 2 connected to the mongo database ")
}).catch((error) => {
    console.log("[failed] task 2 " + error);
    process.exit();
})