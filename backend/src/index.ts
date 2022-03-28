import * as path from 'path';
import express, { request, response } from 'express';
import * as fs from 'fs';
import cors from 'cors';
import { spawnSync } from 'child_process';
import { parse } from 'csv-parse';

const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
    origin: allowedOrigins
};

const app = express();

app.use(cors(options));

const PORT = 5000;

app.get('/debug', (request, response) => {
    response.send('hello')
})

app.get('/clusterResult', (request, response) => {
    const resultsPath = path.resolve(__dirname, '../../data/cluster.csv');
    console.log(resultsPath);
    const headers = ["", "id", 'text', 'agg_bert_row', "answer_length","x_position","y_position"];
    // ,id,text,agg_bert_row,

    const fileContent = fs.readFileSync(resultsPath );
    var content;
    parse(fileContent, {
        delimiter: ',',
        columns: headers,
      }, (error, result) => {
        if (error) {
          // console.error(error);
        }
    
        result.shift();
        result.forEach((value: any) => {
            value.id = parseInt(value.id);
            value.agg_bert_row = parseInt(value.agg_bert_row);
        })
        content = result;
        response.send({clusteredAnswers: content})
        // console.log(content);
    });
})

app.get('/distantResult', (request, response) => {
    const similarPoint = require('../../data/most_similar_5_id.json');
    const similarAnswer = require('../../data/most_similar_5_answer.json');
    const similarContent = [];
    var clusters = Object.keys(similarPoint);
    // console.log(clusters)
    for (var cluster of clusters) {
        similarContent.push({cluster:cluster,id:similarPoint[cluster],answer:similarAnswer[cluster]})
        };
    response.send({clusters:clusters, similarContent: similarContent})
})

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});