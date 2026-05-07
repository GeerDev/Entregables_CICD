const https = require('https');

const url = 'https://favqs.com/api/qotd';

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const quote = json.quote;
      console.log('');
      console.log('💬 Quote of the Day:');
      console.log(`"${quote.body}"`);
      console.log(`— ${quote.author}`);
      console.log('');
    } catch (err) {
      console.error('Failed to parse response:', err.message);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('Failed to fetch motivational quote:', err.message);
  process.exit(1);
});
