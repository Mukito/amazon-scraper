import requests

payload = { 'api_key': '2a541e5ee70d119a406ebf3bbaafeef2', 'url': 'https://www.amazon.com/s?k=${encodeURIComponent(keyword)}' }
r = requests.get('https://api.scraperapi.com/', params=payload)
print(r.text)
