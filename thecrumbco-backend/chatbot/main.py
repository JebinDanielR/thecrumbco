from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from chatbot import chatbot_response

app = FastAPI()

# ✅ Enable CORS (Angular frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # change to your Angular URL later for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Request model
class ChatRequest(BaseModel):
    message: str


# ✅ Root route (optional test)
@app.get("/")
def home():
    return {"message": "Crumb Co Chatbot API Running 🍪"}


# ✅ Chat endpoint
@app.post("/chat")
def chat(req: ChatRequest):

    response = chatbot_response(req.message)

    return response


# ✅ Health check (optional but useful)
@app.get("/health")
def health():
    return {"status": "ok"}