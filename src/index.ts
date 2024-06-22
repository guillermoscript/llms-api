import express, { Request, Response } from 'express';
import { openai } from '@ai-sdk/openai';
import { generateObject, generateText, streamText } from 'ai';
import dotenv from 'dotenv';
import { google } from '@ai-sdk/google';
import { ollama } from 'ollama-ai-provider';
import { z } from 'zod';

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
        model: google('models/gemini-pro'),
        // model: openai('gpt-3.5-turbo'),
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

app.get('/object-generation', async (req: Request, res: Response) => {
    const { object } = await generateObject({
        // for object generation, please refer to https://sdk.vercel.ai/docs/foundations/providers-and-models to check which models support object generation
        model: google('models/gemini-1.5-pro-latest'),
        schema: z.object({
            recipe: z.object({
                name: z.string(),
                ingredients: z.array(z.string()),
                steps: z.array(z.string()),
            }),
        }),
        prompt: 'Generate a lasagna recipe.',
    });

    res.json(object);
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

