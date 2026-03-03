const axios = require('axios');

const testGemini = async () => {
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    const apiKey = 'AIzaSyBog74VYQXQuoe7yjnoX1bIusT0JNcNu4Q';
    console.log('Using Key:', apiKey.substring(0, 10) + '...');

    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: 'Say "Working"' }] }],
            }
        );
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error('Error Status:', err.response?.status);
        console.error('Error Data:', JSON.stringify(err.response?.data, null, 2));
        console.error('Error Message:', err.message);
    }
};

testGemini();
