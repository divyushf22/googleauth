const express = require('express');
const app = express();
const customersRoute = require('./routes/customer');
const imageuploadRoute = require('./routes/imageupload');
const cors = require('cors')



app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use('/customers', customersRoute)

app.use('/image', imageuploadRoute)
app.listen('8000', (req,res)=>{
    console.log("Listening on port 8000");
})




