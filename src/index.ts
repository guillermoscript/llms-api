import express, { Request, Response } from 'express';
import { openai } from '@ai-sdk/openai';
import { CoreMessage, generateText, streamText } from 'ai';
import dotenv from 'dotenv';
import * as readline from 'node:readline/promises';
import { google } from '@ai-sdk/google';

dotenv.config()
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

app.get('/gemini', async (req: Request, res: Response) => {
    const { text } = await generateText({
        // model: google('models/gemini-pro'),
        model: openai('gpt-3.5-turbo'),
        prompt: 'Write a vegetarian lasagna recipe for 4 people.',
    });

    res.send(text);
});

app.get('/stream', async (req: Request, res: Response) => {
    const result = await streamText({
        model: google('models/gemini-pro'),
        prompt: 'Write a vegetarian lasagna recipe for 4 people.',
    });

    res.setHeader('Content-Type', 'text/plain');
    for await (const delta of result.textStream) {
        res.write(delta); // Stream the response back to the client
    }
    res.end(); // End the response once streaming is complete
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

