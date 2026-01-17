from langchain.chat_models import init_chat_model
from dotenv import load_dotenv

load_dotenv()

llm = init_chat_model(model="google_genai:gemini-2.5-flash")
 

# import os
# # 1. Hide the "oneDNN" and "Symlink" warnings
# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
# os.environ['HF_HUB_DISABLE_SYMLINKS_WARNING'] = '1'

# from langchain_huggingface import ChatHuggingFace, HuggingFacePipeline

# # 2. Initialize the LLM
# # Note: Ensure 'torch' is installed before running this
# print("🚀 Loading TinyLlama model (this may take a minute)...")

# # ... inside core/chat_logic.py ...

# model = HuggingFacePipeline.from_model_id(
#     model_id="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
#     task="text-generation",
#     pipeline_kwargs=dict(
#         temperature=0.1,
#         max_new_tokens=256,
#         do_sample=True,
#         repetition_penalty=1.2,
#         return_full_text=False  # <--- ADD THIS LINE to stop the repetition!
#     )
# )

# llm= ChatHuggingFace(llm=model)