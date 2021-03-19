const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance(){
    let api_key=process.env.API_KEY;
    let api_url=process.env.API_URL;
    /*let api_key="F25A4q6Ciya9Azh3G1mgUgut-hnxGyTJHXUIUWN07fT7";
    let api_url="https://api.us-east.natural-language-understanding.watson.cloud.ibm.com/instances/0ef697cf-c52e-411f-a71d-9b53bf5168eb";*/

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const {IamAuthenticator} = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version:'2021-03-19',
        authenticator: new IamAuthenticator({
            apikey:api_key,
        }),
        serviceUrl: api_url
    });
    return naturalLanguageUnderstanding;
}

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

/*  app.get("/url/emotion", (req,res) => {

    return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
    return res.send("text sentiment for "+req.query.text);
});*/

app.get("/url/emotion", (req,res) => {

    let naturalLanguageUnderstanding = getNLUInstance();
    console.log(req.query.url);
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'keywords': {
                'sentiment': false,
                'emotion': true,
                'limit':10
              }
        }
      };
      
      naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            let result = JSON.stringify(analysisResults, null, 2);
            console.log(result);
            res.send(result);
        })
        .catch(err => {
          console.log('error:', err);
        });
});

app.get("/url/sentiment", (req,res) => {
    let naturalLanguageUnderstanding = getNLUInstance();
    console.log(req.query.url);
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'keywords': {
                'sentiment': true,
                'emotion': false,
                'limit':10
              }
        }
      };
      
      naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            let result = JSON.stringify(analysisResults, null, 2);
            console.log(analysisResults.result.keywords[0].sentiment.label);
            res.send(JSON.stringify(analysisResults.result.keywords[0].sentiment.label, null, 2));
        })
        .catch(err => {
          console.log('error:', err);
        });
});

app.get("/text/emotion", (req,res) => {

    let naturalLanguageUnderstanding = getNLUInstance();
    console.log(req.query.text);
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'keywords': {
                'sentiment': false,
                'emotion': true,
                'limit':10
              }
        }
      };
      
      naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            let result = JSON.stringify(analysisResults, null, 2);
            console.log(result);
            res.send(result);
        })
        .catch(err => {
          console.log('error:', err);
        });
});

app.get("/text/sentiment", (req,res) => {
    let naturalLanguageUnderstanding = getNLUInstance();
    console.log(req.query.text);
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'keywords': {
                'sentiment': true,
                'emotion': false,
                'limit':10
              }
        }
      };
      
      naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            let result = JSON.stringify(analysisResults, null, 2);
            console.log(analysisResults.result.keywords[0].sentiment.label);
            res.send(JSON.stringify(analysisResults.result.keywords[0].sentiment.label, null, 2));
        })
        .catch(err => {
          console.log('error:', err);
        });
    //return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(3000, () => {
    console.log('Listening', server.address().port)
})

