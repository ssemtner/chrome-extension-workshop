import { GoogleGenerativeAI } from "@google/generative-ai";
import { env_var } from "./env"

const genAI = new GoogleGenerativeAI(env_var.GEMINI_API_KEY);

//-------------------ACTIVITY 2 -----------------
async function clickAttachementsButton() {
    // Get the html button of the Attachements tab using document.querySelector()
    // const attachmentsButton = TODO

    if (attachmentsButton) {
        // TODO Click on the button using .click()


        // Give a little bit of time to process
        await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
        alert('Attachments button not found.');
    }

}

async function fetchTranscriptData() {
    // Get the html of the download transcript button
    // const downloadLinkButton = TODO

    if (!downloadLinkButton) {
        throw new Error('Download link not found.');
    }

    // Extract the url from the element using .getAttribute
    // const url = TODO

    // Fetch the url
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.text();
}


//-------------------ACTIVITY 3 -----------------
async function paraphraseTranscript(data) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = "YOUR TURN TO PROMT ENGINEER THIS";
    // TOD Use generateContent() with your promt and store in result

    const response = await result.response;
    const text = await response.text();
    chrome.runtime.sendMessage({ data: text });
}

async function downloadAndParaphraseTranscript() {
    try {
        const data = await fetchTranscriptData();
        await paraphraseTranscript(data);
    } catch (error) {
        console.error('Error in processing transcript:', error);
        chrome.runtime.sendMessage({ error: error.message });
    }
}

async function executeTasks() {
    await clickSubmitButton();
    await downloadAndParaphraseTranscript();
}

executeTasks();
