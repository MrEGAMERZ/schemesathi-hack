const axios = require('axios');

const test = async (url, name) => {
    const apiKey = 'AIzaSyBog74VYQXQuoe7yjnoX1bIusT0JNcNu4Q';
    console.log(`\nTesting ${name}: ${url}`);
    try {
        const response = await axios.post(
            `${url}?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: 'Say "Working"' }] }],
            }
        );
        console.log(`✅ ${name} Success!`);
        return true;
    } catch (err) {
        console.error(`❌ ${name} Failed: ${err.response?.status} - ${err.response?.data?.error?.message || err.message}`);
        return false;
    }
};

const run = async () => {
    // Try v1
    await test('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent', 'v1 flash');
    await test('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', 'v1 pro');

    // Try v1beta with pro
    await test('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', 'v1beta pro');
};

run();
