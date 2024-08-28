/*import React, {useState} from "react";
import {TextInput, View, StyleSheet, Text, Button} from "react-native";
import axios from 'axios';


const Chat = () => {
    const [prompt, setPrompt] = useState('')
    const [result, setResult] = useState('')

const getResultFromOpenApi = async () => {
    try {
        const response = await axios.post('http://10.116.1.191:9004/openapi', {
            prompt
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const jsonData = response.data;
        setResult(`${jsonData.result}`);
        //setResult(`${jsonData.result} y los token utilizados fueron ${jsonData.token}`);

    } catch (error) {
        console.error('Error al obtener resultados de la API:', error);
    }
};

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {'Ingrese el texto que desea clasificar '}
            </Text>
            <TextInput style={styles.input} value={prompt} onChangeText={setPrompt}/>
            <Button title={'Enviar'} onPress={getResultFromOpenApi}/>
            <Text style={styles.text}>
                {result}
            </Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center'
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        margin: 10
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold'
    }
})

export default Chat
*/

import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const Chat = () => {
    const [prompt, setPrompt] = useState(''); 
    const [result, setResult] = useState(''); 
    const [texts, setTexts] = useState([]); 
    const [editIndex, setEditIndex] = useState(null); 

    const getResultFromOpenApi = async () => {
        try {
            const response = await axios.post('http://10.116.1.6:9004/openapi', {
                prompt
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const jsonData = response.data;
            setResult(`${jsonData.result}`);

            
            if (editIndex !== null) {
                const updatedTexts = [...texts];
                updatedTexts[editIndex] = prompt;
                setTexts(updatedTexts);
                setEditIndex(null); 
            } else {
                if (texts.length >= 10) {
                    texts.shift(); 
                }
                setTexts([...texts, prompt]);
            }

            setPrompt(''); // Limpia el campo de texto

        } catch (error) {
            console.error('Error al obtener resultados de la API:', error);
        }
    };

    const handleEdit = (index) => {
        setPrompt(texts[index]);
        setEditIndex(index);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Ingrese el texto que usar:</Text>
            <TextInput
                style={styles.input}
                value={prompt}
                onChangeText={setPrompt}
            />
            <Button title={editIndex !== null ? 'Actualizar' : 'Enviar'} onPress={getResultFromOpenApi} />
            <Text style={styles.text}>{result}</Text>

            {/* Renderizar los textos con la opción de editar */}
            <FlatList
                data={texts}
                renderItem={({ item, index }) => (
                    <View style={styles.itemContainer}>
                        <Text>{item}</Text>
                        <Button title={'Editar'} onPress={() => handleEdit(index)} />
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    text: {
        fontSize: 16,
        marginVertical: 8,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    }
});

export default Chat;