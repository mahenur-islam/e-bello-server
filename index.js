const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json());



app.get('/', (req,res)=>{
    res.send('e-bello is running from the server')
})

app.listen(port, ()=>{
    console.log(`e-cello server is running on port: ', ${port}`);
})