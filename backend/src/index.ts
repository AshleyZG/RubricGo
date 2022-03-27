
   
import * as path from 'path';
import express, { request, response } from 'express';
import * as fs from 'fs';
import cors from 'cors';
import { spawnSync } from 'child_process';

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

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});