import { GoogleGenerativeAI } from "@google/generative-ai";
import {env_var} from "./env"

const genAI = new GoogleGenerativeAI(env_var.GEMINI_API_KEY);

async function clickSubmitButton() {
    const submitButton = document.querySelector("#tab-attachments-tab > span");
    if (submitButton) {
        submitButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
        alert('Submit button not found.');
    }
}

async function fetchTranscriptData() {
    const downloadLink = document.querySelector('a.js-download-attachment-link');
    if (!downloadLink) {
        throw new Error('Download link not found.');
    }
    const link = downloadLink.getAttribute('href');
    const response = await fetch(link);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.text();
}

async function paraphraseTranscript(data) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const prompt = "Give me a summary of this lecture: " + data;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    chrome.runtime.sendMessage({ data: text });
    return text
}

async function sendNotesToNotion(data) {
    const apiKey = env_var.NOTION_API_KEY

    const databaseId = "";
    const url = 'https://api.notion.com/v1/pages';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28',
            },
            body: JSON.stringify({
                parent: {
                    database_id: databaseId
                },
                properties: {
                    Name: {
                        title: [
                            {
                                text: {
                                    content: "LECTURE NOTES"
                                }
                            }
                        ]
                    }
                },
                children: [
                    {
                        type: 'paragraph',
                        paragraph: {
                            color: 'default',
                            rich_text: [
                                {
                                    type: 'text',
                                    text: { content: "TODO add transcribed data", link: null },
                                    annotations: {
                                        bold: false,
                                        italic: false,
                                        strikethrough: false,
                                        underline: false,
                                        code: false,
                                        color: 'default',
                                    }
                                }
                            ]
                        }
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create Notion entry: ${response.status} - ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log("Notion entry created:", responseData);
        return responseData
    } catch (error) {
        console.error('Error:', error);
        chrome.runtime.sendMessage({ error: error.message });
    }
}


/* ACTIVITY 1 use async logic to call the functions in order*/
async function executeTasks() {
    
}

executeTasks();
