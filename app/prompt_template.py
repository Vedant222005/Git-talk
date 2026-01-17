import os
from datetime import datetime
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_mongodb import MongoDBAtlasVectorSearch
from pymongo import MongoClient
from langchain_core.prompts import ChatPromptTemplate , PromptTemplate
from langchain.chat_models import init_chat_model

        # Create chat template
chat_template = ChatPromptTemplate.from_messages(
        [( "system",
        "You are a helpful Senior Software Engineer.\n"
        "Your task is to answer questions about the repository '{target_repo_id}' "
        "using ONLY the code context provided below.\n\n"
        "### Guidelines for your Answer:\n"
        "1. Keep it simple: Explain in plain, easy-to-understand English.\n"
        "2. Be concise: Do not write long answers. Get straight to the point.\n"
        "3. Use examples only if needed: Show a small code snippet from the context.\n"
        "4. Strict truth: If the answer is NOT clearly present in the context, reply exactly with 'Mala mahit nahi'. Do NOT guess.\n"
        "5. Citations: List the file names you used at the very bottom of your answer.\n\n"
        "### Code Context:\n"
        "{context_text}\n"
    ),
    ("human", "{user_query}")]
  )


