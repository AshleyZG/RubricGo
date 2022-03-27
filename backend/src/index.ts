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
    const headers = ["id", 'text', 'agg_bert_row'];
    const fileContent = fs.readFileSync(resultsPath );
    var content;
    parse(fileContent, {
        delimiter: ',',
        columns: headers,
      }, (error, result) => {
        if (error) {
          console.error(error);
        }
    
        // console.log("Result", result);
        // console.log(result[0] as AnswerItem]);
        result.shift();
        result.forEach((value: any) => {
            value.id = parseInt(value.id);
            value.agg_bert_row = parseInt(value.agg_bert_row);
        })
        content = result;
        response.send({clusteredAnswers: content})
        // console.log(content);
    });
    // console.log(content);


})

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});