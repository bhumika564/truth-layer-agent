from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import fitz  
import google.generativeai as genai
from tavily import TavilyClient
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


model = genai.GenerativeModel('gemini-2.5-flash-lite')

def extract_text_from_pdf(file_stream):
    doc = fitz.open(stream=file_stream, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Fact-Check Agent backend is live!"})

@app.route('/fact-check', methods=['POST'])
def fact_check_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        # STEP 1: Extract Text & Claims
        pdf_text = extract_text_from_pdf(file.read())
        
        extraction_prompt = f"""
        Read the following text and extract all specific claims (stats, dates, financial figures, technical figures).
        CRITICAL INSTRUCTION: Extract the FULL COMPLETE SENTENCE containing the claim.
        Return an array of strings.
        Text to analyze:
        {pdf_text}
        """
        
        # FORCING 100% VALID JSON OUTPUT
        extract_response = model.generate_content(
            extraction_prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        claims_list = json.loads(extract_response.text)
        
        if not claims_list:
             return jsonify({"status": "success", "results": []})

        # STEP 2: Fast Web Search
        all_contexts = ""
        for index, claim in enumerate(claims_list):
            search_result = tavily_client.search(query=claim, search_depth="basic", max_results=2)
            all_contexts += f"\n--- CLAIM {index + 1} ---\nOriginal Claim: {claim}\nWeb Findings:\n"
            for res in search_result.get('results', []):
                all_contexts += f"- {res['content']}\n"
        
        # STEP 3: Batch Verification
        verification_prompt = f"""
        You are a strict Fact-Checking Agent. 
        Evaluate the following batch of claims against their corresponding Web Findings.

        {all_contexts}

        Categorize each claim STRICTLY as "Verified", "Inaccurate", or "False".
        Provide a brief "reason" based on the web findings.
        
        Return an array of JSON objects with keys: "claim", "status", "reason".
        """
        
        # FORCING 100% VALID JSON OUTPUT AGAIN
        verification_response = model.generate_content(
            verification_prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        final_report = json.loads(verification_response.text)
            
        return jsonify({
            "status": "success",
            "results": final_report
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)