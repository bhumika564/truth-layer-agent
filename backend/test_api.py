import requests

url = "http://127.0.0.1:5000/fact-check"
file_path = "dummy.pdf"  

print("Extracting claims, please wait...")
with open(file_path, 'rb') as f:
    response = requests.post(url, files={'file': f})
    
print("Result:")
print(response.json())