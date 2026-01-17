import os
# 1. Hide the "oneDNN" and "Symlink" warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['HF_HUB_DISABLE_SYMLINKS_WARNING'] = '1'

from langchain_huggingface import ChatHuggingFace, HuggingFacePipeline

# 2. Initialize the LLM
# Note: Ensure 'torch' is installed before running this
print("🚀 Loading TinyLlama model (this may take a minute)...")

llm = HuggingFacePipeline.from_model_id(
    model_id='TinyLlama/TinyLlama-1.1B-Chat-v1.0',
    task='text-generation',
    pipeline_kwargs=dict(
        temperature=0.5,
        max_new_tokens=100,
        do_sample=True # Required when using temperature > 0
    )
)

model = ChatHuggingFace(llm=llm)

# 3. Invoke the model
print("🤖 Thinking...")
result = model.invoke("What is the capital of India")

print("\n--- Result ---")
print(result.content)