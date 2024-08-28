import cors from "cors"
import multer, { FileFilterCallback } from "multer";
import * as dotenv from 'dotenv';
import {v4 as uuidv4} from 'uuid';
import express, { Request }from "express";
import {process_doc} from "./lang_script";
import axios from 'axios';

dotenv.config()

const app = express()
app.use(express.json())

const PORT = 9004

app.use(cors())

import * as path from "path";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (fileExtension !== '.pdf') {
        callback(new Error('Only PDFs are allowed'));
    } else {
        callback(null, true);
    }
};

const upload = multer({
    storage,
    fileFilter
});

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file || !req.body?.question) {
        return res.status(400).send('Faltan datos');
    }
    try {
        const filePath = path.join(__dirname, '../uploads', req.file.filename);
        console.log('Ruta del archivo:', filePath); 
        const response = await process_doc(filePath, req.body.question);
        console.log('Respuesta del procesamiento:', response);
        
        if (response && response.text ) {
            res.send({
                response: response.text,
                token: response.token || 'Token info not available'
            });
        } else {
            console.error('Respuesta inesperadaaa:', response);
            res.status(500).send('Error en la respuesta del procesamiento');
        }
    } catch (error) {
        console.error('Error en el procesamiento del documento:', error);
        res.status(500).send('Error en el procesamiento del documento');
    }
});

let names = [
    {
        id: uuidv4(),
        firstName: 'Jessica',
        lastName: 'Victoria'
    },
    {
        id: uuidv4(),
        firstName: 'Lea',
        lastName: 'Rolfes'
    }
]
app.get("/ping", (req, res) => {
    console.log("alguien ha dado pin!!")
    res.setHeader("Content-Type", "application/json")
    res.send("pong")
})

app.get("/hola/:nombre/:apellido", (req, res) => {
    console.log("alguien ha dado pin!!")
    res.setHeader("Content-Type", "application/json")
    const nombre = req.params.nombre
    const apellido = req.params.apellido
    console.log("alguien ha ingresado su nombre")
    res.send({nombre, apellido})
})

app.get('/nombres', (req, res) => {

    res.setHeader('Content-Type', 'application/json')
    res.send(names)
})

app.post('/nombres', (req, res) => {
    const item = {...req.body, id: uuidv4()};
    names.push(item)
    res.send(item)
})

//EXAMEN

import { OpenAI } from '@langchain/openai';
// Crear una instancia de Configuration con tu clave API
const configuration = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY || '',
});

// Crear una instancia de OpenAI con la configuración
const openai = new OpenAI(configuration);

//const generatePromptd = (numberToConvert: number) => {
//return `Convierte este número ${numberToConvert} a binario`;
//}

const generatePrompt = (textToConvert: String) => {
    return `El número en binario es: y número de vocales que tiene la palabra ${textToConvert}`
};

/*try {
    const { prompt } = req.body;
    const combinedPrompt = generatePrompt(prompt) + "\n" + generatePromptd(prompt);
    
    const completion = await openai.completionWithRetry({
        model: 'gpt-3.5-turbo-instruct',
        prompt: combinedPrompt,
        temperature: 0.1
    });

*/

app.post('/openapi', async (req, res) => {
    try {
        const { prompt } = req.body;
        const completion = await openai.completionWithRetry({
            model: 'gpt-3.5-turbo-instruct',
            prompt: generatePrompt(prompt),
            temperature: 0.1
        });
        if (completion) {
            if (completion.usage) {
                if (completion.choices[0]) {
                    res.send({
                        result: completion.choices[0].text,
                        //token: completion.usage.total_tokens
                    });
                } else {
                    res.status(500).send({error: 'No se pudo obtener la información de uso.'});
                }
            } else {
                res.status(500).send({error: 'No se pudo obtener la información de uso.'});
            }
        } else {
            res.status(500).send({error: 'No se pudo obtener la información de uso.'});
        }
        //res.send({ result: completion.data.choices[0].text.trim(), token: completion.data.usage.total_tokens });
    } catch (error) {
        console.error('Error en la ruta /openapi:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
});


/*const generatePromptVocal = (vocalToConvert: string) => {
    return `Cuántas vocales tiene la palabra ${vocalToConvert} y dame las estadisticas`
}
app.post('/openapiVocal', async (req, res) => {
    try {
        const { prompt } = req.body;
        const completion = await openai.completionWithRetry({
            model: 'gpt-3.5-turbo-instruct',
            prompt: generatePromptVocal(prompt),
            temperature: 0.1
        });
            if (completion.usage) {
                if (completion.choices[0]) {
                    res.send({
                        result: completion.choices[0].text,
                        token: completion.usage.total_tokens
                    });
                } else {
                    res.status(500).send({error: 'No se pudo obtener la información de uso.'});
                }
        } else {
            res.status(500).send({error: 'No se pudo obtener la información de uso.'});
        }
        //res.send({ result: completion.data.choices[0].text.trim(), token: completion.data.usage.total_tokens });
    } catch (error) {
        console.error('Error en la ruta /openapi:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
});
*/

// Configuración de Hugging Face

app.post('/classifyText', async (req, res) => {
    try {
        const { prompt } = req.body;

        // Categorías predefinidas para la clasificación
        const candidate_labels = ['technology', 'sports', 'politics', 'entertainment'];

        // Realiza una solicitud a la API de Hugging Face
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
            { inputs: prompt, parameters: { candidate_labels } },
            { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
        );


        const result = response.data;
        const resultText = result.labels[0];
        const score = result.scores[0];

        res.send({
            result: resultText,
            score: score
        });
    } catch (error) {
        console.error('Error en la ruta /classifyText:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
});



app.delete('/nombres/:id', (req, res) => {
    names = names.filter(n => n.id !== req.params.id)
    res.status(204).end()
})

app.get('/nombres/:id', (req, res) => {
    const searchedName = names.find(n => n.id === req.params.id)
    if (!searchedName)
        res.status(400).end()
    res.send(searchedName)
})

app.put('/nombres/:id', (req, res) => {
    const index = names.findIndex(n => n.id === req.params.id)
    if (index === -1)
        res.status(404).end()
    names[index] = {...req.body, id: req.params.id}
    res.status(204).end()
})
app.listen(PORT, () => {
    console.log(`running application on port ${PORT}`)

})