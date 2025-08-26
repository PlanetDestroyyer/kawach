from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
import os
import logging
from sentence_transformers import SentenceTransformer, util
import torch
import google.generativeai as genai

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# -----------------------------
# Config
# -----------------------------
PDF_FILES = ["data/laws.pdf", "data/fileC.pdf"]
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # Set your API key in environment variables

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key="AIzaSyCeu2N5VOIL-v3Yiv2WyK0k_gPWOgMnKPQ")
else:
    logger.warning("GEMINI_API_KEY not found in environment variables")

# -----------------------------
# Simple PDF Processing (No Vector DB)
# -----------------------------
class SimplePDFRetriever:
    def __init__(self, pdf_files):
        self.documents = []
        self.embeddings_model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
        self.doc_embeddings = None
        self.load_and_process_pdfs(pdf_files)
    
    def load_and_process_pdfs(self, pdf_files):
        """Load and split PDF documents into chunks"""
        all_docs = []
        
        for file_path in pdf_files:
            if not os.path.exists(file_path):
                logger.warning(f"PDF file not found: {file_path}")
                continue
                
            try:
                logger.info(f"Loading PDF: {file_path}")
                loader = PyPDFLoader(file_path)
                file_docs = loader.load()
                all_docs.extend(file_docs)
                logger.info(f"Loaded {len(file_docs)} pages from {file_path}")
            except Exception as e:
                logger.error(f"Error loading {file_path}: {str(e)}")
        
        if not all_docs:
            raise Exception("No PDF documents could be loaded!")
        
        # Split documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=100,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
        
        self.documents = text_splitter.split_documents(all_docs)
        logger.info(f"Split documents into {len(self.documents)} chunks")
        
        # Create embeddings for all document chunks
        doc_texts = [doc.page_content for doc in self.documents]
        self.doc_embeddings = self.embeddings_model.encode(doc_texts, convert_to_tensor=True)
        logger.info("Created embeddings for document chunks")
    
    def get_relevant_docs(self, query, k=5):
        """Get most relevant documents for a query"""
        if not self.documents:
            return []
        
        # Encode the query
        query_embedding = self.embeddings_model.encode(query, convert_to_tensor=True)
        
        # Calculate similarities
        similarities = util.pytorch_cos_sim(query_embedding, self.doc_embeddings)[0]
        
        # Get top k most similar documents
        top_results = torch.topk(similarities, k=min(k, len(self.documents)))
        
        relevant_docs = []
        for idx in top_results.indices:
            relevant_docs.append(self.documents[idx])
        
        return relevant_docs

# Initialize PDF retriever
try:
    pdf_retriever = SimplePDFRetriever(PDF_FILES)
except Exception as e:
    logger.error(f"Failed to initialize PDF retriever: {e}")
    pdf_retriever = None

# -----------------------------
# Google Gemini Setup
# -----------------------------
class GeminiLLM:
    def __init__(self):
        if not GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        try:
            # Initialize Gemini Pro model
            self.model = genai.GenerativeModel('gemini-pro')
            logger.info("Successfully initialized Google Gemini Pro")
        except Exception as e:
            logger.error(f"Error initializing Gemini: {e}")
            raise
    
    def generate_response(self, prompt: str) -> str:
        """Generate response using Gemini"""
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=1024,
                    top_p=0.8,
                    top_k=40
                )
            )
            return response.text
        except Exception as e:
            logger.error(f"Error generating response with Gemini: {e}")
            return f"Sorry, I encountered an error while processing your question: {str(e)}"

# Initialize Gemini LLM
try:
    gemini_llm = GeminiLLM()
except Exception as e:
    logger.error(f"Failed to initialize Gemini: {e}")
    gemini_llm = None

# -----------------------------
# Enhanced Prompts for Gemini
# -----------------------------
WOMEN_SAFETY_PROMPT = """You are a specialized Women Safety Legal Assistant powered by AI. Your role is to provide comprehensive, empathetic, and actionable guidance on women's safety and legal rights in India.

**Your expertise includes:**
- Domestic violence laws and procedures
- Sexual harassment at workplace
- Dowry harassment and related laws
- Legal procedures and rights
- Emergency safety protocols
- Support resources and helplines

**Guidelines for your responses:**
1. Always be empathetic, supportive, and non-judgmental
2. Provide detailed legal information with specific law references when available
3. Include practical, step-by-step actionable advice
4. Mention relevant sections of Indian laws (IPC, CrPC, Protection of Women from Domestic Violence Act, etc.)
5. Suggest appropriate emergency contacts, helplines, or resources
6. Clearly distinguish between immediate safety measures and legal procedures
7. If the situation seems urgent, prioritize safety advice
8. Always encourage seeking professional legal help when necessary

**Context from Legal Documents:**
{context}

**User Question:** {question}

**Please provide a comprehensive response that includes:**

🚨 **Immediate Safety Considerations** (if applicable):
- Any urgent steps to ensure safety

⚖️ **Legal Rights and Options:**
- Relevant laws and sections
- Legal procedures available
- Rights of the person

📋 **Step-by-Step Action Plan:**
- Detailed procedures to follow
- Documentation requirements
- Where to file complaints

📞 **Resources and Support:**
- Relevant helplines (National Commission for Women: 7827170170, Women Helpline: 1091, etc.)
- Support organizations
- Legal aid options

**Important:** If this is an emergency situation involving immediate danger, please call emergency services (100/112) or women helpline (1091) immediately.

Your Response:"""

def generate_response(question: str) -> dict:
    """Generate response using retrieved documents and Gemini"""
    if not pdf_retriever or not gemini_llm:
        return {
            "answer": "Sorry, the system is not properly initialized. Please check if PDF files are available and Gemini API is configured.",
            "sources": [],
            "error": True
        }
    
    try:
        # Get relevant documents
        relevant_docs = pdf_retriever.get_relevant_docs(question, k=5)
        
        if not relevant_docs:
            context = "No specific legal document information found for this query. Providing general guidance based on Indian women safety laws."
            sources = []
        else:
            # Combine relevant document texts (limit context length)
            context_parts = []
            total_length = 0
            max_context_length = 8000  # Limit context to avoid token limits
            
            for doc in relevant_docs:
                if total_length + len(doc.page_content) < max_context_length:
                    context_parts.append(doc.page_content)
                    total_length += len(doc.page_content)
                else:
                    break
            
            context = "\n\n---\n\n".join(context_parts)
            
            # Extract source information
            sources = []
            for doc in relevant_docs:
                meta = doc.metadata
                source_info = f"{os.path.basename(meta.get('source', 'Unknown'))} (page {meta.get('page', 'N/A')})"
                if source_info not in sources:
                    sources.append(source_info)
        
        # Create prompt for Gemini
        prompt = WOMEN_SAFETY_PROMPT.format(context=context, question=question)
        
        # Generate response using Gemini
        response = gemini_llm.generate_response(prompt)
        
        return {
            "answer": response.strip(),
            "sources": sources,
            "error": False
        }
        
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        return {
            "answer": f"An error occurred while processing your question. Please try again or contact support if the issue persists.",
            "sources": [],
            "error": True
        }

# -----------------------------
# FastAPI Setup
# -----------------------------
app = FastAPI(
    title="Women Safety Legal Assistant API",
    description="AI-powered chatbot for women safety and legal guidance",
    version="1.0.0"
)

class QueryRequest(BaseModel):
    question: str
    
    class Config:
        schema_extra = {
            "example": {
                "question": "What should I do if I'm facing domestic violence?"
            }
        }

class ChatResponse(BaseModel):
    question: str
    answer: str
    sources: list
    error: bool = False

@app.get("/")
async def root():
    return {
        "message": "Women Safety Legal Assistant API is running 🚀",
        "endpoints": {
            "ask": "POST /ask - Ask a question about women safety and legal rights",
            "health": "GET /health - Check API health"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy" if (pdf_retriever and gemini_llm) else "unhealthy",
        "pdf_loaded": pdf_retriever is not None,
        "gemini_initialized": gemini_llm is not None,
        "documents_count": len(pdf_retriever.documents) if pdf_retriever else 0,
        "api_key_configured": GEMINI_API_KEY is not None
    }

@app.post("/ask", response_model=ChatResponse)
async def ask_question(request: QueryRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    try:
        result = generate_response(request.question)
        
        return ChatResponse(
            question=request.question,
            answer=result["answer"],
            sources=result["sources"],
            error=result["error"]
        )
        
    except Exception as e:
        logger.error(f"API Error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# -----------------------------
# Startup Event
# -----------------------------
@app.on_event("startup")
async def startup_event():
    logger.info("Women Safety Legal Assistant API starting")