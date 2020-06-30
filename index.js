const express = require('express');
const shortUrl = require('./models/shortUrl');
const connectDB = require('./config/db');
const app = express();

connectDB();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false}))

app.get('/', async (req, res) => {
    const shortUrls = await shortUrl.find();
    res.render('index', { shortUrls: shortUrls});
})

app.post('/shortUrls', async (req, res) => {
    let url = await shortUrl.findOne({ long: req.body.longUrl });
    if(url){
        res.redirect('/');
    }else{
        await shortUrl.create({ long: req.body.longUrl});   
        res.redirect('/');
    }

})

app.get('/:shortUrl',  async (req, res) => {
    // res.param.shortUrl;
    const short = await shortUrl.findOne({ short: req.params.shortUrl });
    if( short == null ) {return res.sendStatus(404)};
    short.clicks++;
    short.save();

    res.redirect(short.long);
})

app.listen(process.env.PORT || 5000);
