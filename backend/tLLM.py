import tensorflow as tf
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableBranch
from langchain_core.runnables.passthrough import RunnableAssign
#from langchain_nvidia_ai_endpoints import ChatNVIDIA, NVIDIAEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.runnables import RunnableLambda
from functools import partial
import os
os.environ["GOOGLE_API_KEY"] = "AIzaSyARbC-4FA1uQE8mWA7aVu6kBkHft5FP5U8"
loaded_model = tf.keras.models.load_model("saved_models/my_model.h5")


embedder = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")


chat_llm = ChatGoogleGenerativeAI(
    model='gemini-2.0-flash',
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params...
) | StrOutputParser()
#instruct_llm = ChatNVIDIA(model="mistralai/mixtral-8x22b-instruct-v0.1") | StrOutputParser()

response_prompt = ChatPromptTemplate.from_messages([("system", "{system}"), ("user", "{input}")])

def RPrint(preface=""):
    def print_and_return(x, preface=""):
        print(f"{preface}{x}")
        return x
    return RunnableLambda(partial(print_and_return, preface=preface))

## "Help them out" system message
good_sys_msg = (
    "You are a coding chatbot. This code entry has been analyzed to be relevant to the coding question. Answer appropriately"
)
## Resist talking about this topic" system message
poor_sys_msg = (
    "You are a coding chatbot. This code entry has been analyzed to be not relevant to the coding question. Reply with an appropriate error message"
)

########################################################################################
## BEGIN TODO

def score_response(query):
    ## TODO: embed the query and pass the embedding into your classifier
    try:
        embedded_query = embedder.embed_query(query)
        embedded_query = np.array(embedded_query)
        embedded_query = embedded_query.reshape(1,-1)

        score = loaded_model(embedded_query)
        print(score)

        return score
    except Exception as e:
        print(f"Here is what went wrong - \n{e}")

    
    ## TODO: return the score for the response
    
    
## END TODO
########################################################################################

chat_chain = (
    { 'input'  : (lambda x:x), 'score' : score_response }
    | RPrint()
    | RunnableAssign(dict(
        system = RunnableBranch(
            ## Switch statement syntax. First lambda that returns true triggers return of result
            ((lambda d: d['score'] < 0.5), RunnableLambda(lambda x: poor_sys_msg)),
            ## ... (more branches can also be specified)
            ## Default branch. Will run if none of the others do
            RunnableLambda(lambda x: good_sys_msg)
        )
    )) | response_prompt | chat_llm
)

########################################################################################

def chat_gen(message, history, return_buffer=True):
    buffer = ""
    for token in chat_chain.stream(message):
        buffer += token
        yield buffer if return_buffer else token

def queue_fake_streaming_gradio(chat_stream, history = [], max_questions=8):

    ## Mimic of the gradio initialization routine, where a set of starter messages can be printed off
    for human_msg, agent_msg in history:
        if human_msg: print("\n[ Human ]:", human_msg)
        if agent_msg: print("\n[ Agent ]:", agent_msg)

    ## Mimic of the gradio loop with an initial message from the agent.
    for _ in range(max_questions):
        message = input("\n[ Human ]: ")
        print("\n[ Agent ]: ")
        history_entry = [message, ""]
        for token in chat_stream(message, history, return_buffer=False):
            print(token, end='')
            history_entry[1] += token
        history += [history_entry]
        print("\n")

## history is of format [[User response 0, Bot response 0], ...]
history = [[None, "Hello! I am a coding agent"]]

## Simulating the queueing of a streaming gradio interface, using python input
queue_fake_streaming_gradio(
    chat_stream = chat_gen,
    history = history
)