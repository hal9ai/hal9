import pandas as pd
from utils import generate_response, load_messages, insert_message, execute_function, save_messages, insert_tool_message, generate_embeddings
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os

########################### Functions ##########################

def retrieve_chunks_from_page_number(page_number, file_to_filter=None):
    # Convert `page_number` from string to integer
    page_number = int(page_number)

    # Load the Parquet file into a DataFrame
    df = pd.read_parquet("./.storage/.text_files.parquet")
    
    # Optionally filter by file
    if file_to_filter:
        df = df[df['filename'] == file_to_filter]
    
    # Filter by page number
    df = df[df['page'] == page_number]
    
    # Remove the 'embedding' column
    df = df.drop(columns=['embedding'], errors='ignore')
    
    # Return the results as a list of dictionaries
    return df.to_dict(orient='records')

def retrieve_chunks_containing_word(word, file_to_filter=None):
    # Load the Parquet file into a DataFrame
    df = pd.read_parquet("./.storage/.text_files.parquet")
    
    # Optionally filter by file
    if file_to_filter:
        df = df[df['filename'] == file_to_filter]
    
    # Filter for chunks containing the word (case-insensitive search)
    df = df[df['text'].str.contains(word, case=False, na=False)]
    
    # Remove the 'embedding' column
    df = df.drop(columns=['embedding'], errors='ignore')
    
    # Return the results as a list of dictionaries
    return df.to_dict(orient='records')

def retrieve_chunks_by_index(chunk_ids, file_to_filter=None):
    # Check if chunk_ids is a string and contains commas (i.e., not a list already)
    if isinstance(chunk_ids, str):
        # Try to parse it as a comma-separated string
        chunk_ids = chunk_ids.split(',')
        # Convert each item to an integer, assuming they represent chunk IDs
        chunk_ids = [int(id) for id in chunk_ids]

    # Ensure chunk_ids is a list
    if not isinstance(chunk_ids, list):
        chunk_ids = [chunk_ids]

    # Load the Parquet file into a DataFrame
    df = pd.read_parquet("./.storage/.text_files.parquet")
    
    # Optionally filter by file
    if file_to_filter:
        df = df[df['filename'] == file_to_filter]
    
    # Ensure chunk_ids is a list
    if not isinstance(chunk_ids, list):
        chunk_ids = [chunk_ids]
    
    # Filter by chunk IDs
    df = df[df['chunk_id'].isin(chunk_ids)]
    
    # Remove the 'embedding' column
    df = df.drop(columns=['embedding'], errors='ignore')
    
    # Return the results as a list of dictionaries
    return df.to_dict(orient='records')

def similarity_search(input_text, top_n="5", file_to_filter=None):
    # Generate the embedding from the input text
    query_embedding = generate_embeddings(text=input_text, model="text-embedding-3-small", client_type="azure")
    
    # Convert `top_n` from string to integer
    top_n = int(top_n)
    
    # Load the Parquet file into a DataFrame
    df = pd.read_parquet("./.storage/.text_files.parquet")
    
    # Optionally filter by file
    if file_to_filter and file_to_filter != "None":
        df = df[df['filename'] == file_to_filter]
    
    # Ensure the embeddings column exists
    if 'embedding' not in df.columns:
        raise ValueError("Embeddings not found in the dataset.")
    
    # Calculate cosine similarity between query_embedding and all embeddings
    df['similarity'] = df['embedding'].apply(
        lambda x: cosine_similarity([query_embedding], [np.array(x)])[0][0]
    )
    
    # Sort by similarity and take the top N
    top_matches = df.nlargest(top_n, 'similarity')
    
    # Drop unnecessary columns and return the result
    top_matches = top_matches.drop(columns=['embedding', 'similarity'], errors='ignore')
    return top_matches.to_dict(orient='records')

def random_pick_chunks(num_chunks, file_to_filter=None):
    # Convert num_chunks to an integer
    num_chunks = int(num_chunks)
    # Load the Parquet file into a DataFrame
    df = pd.read_parquet("./.storage/.text_files.parquet")
    
    # Optionally filter by specific file if 'file_to_filter' is provided
    if file_to_filter or file_to_filter != "None":
        df = df[df['filename'] == file_to_filter]
    
    # Ensure that num_chunks does not exceed the available chunks in the filtered DataFrame
    if num_chunks > len(df):
        return df.drop(columns=['embedding']).to_dict(orient='records')
    
    # Randomly select 'num_chunks' from the filtered DataFrame
    selected_chunks = df.sample(n=num_chunks)
    
    # Remove the 'embedding' column, as we don't need it in the response
    selected_chunks = selected_chunks.drop(columns=['embedding'])
    
    # Return the selected chunks along with all relevant metadata
    return selected_chunks.to_dict(orient='records')

def final_response(final_message):
    print(final_message)
    return final_message

########################### Descriptions ########################## 


analyze_text_file_description = {
    "type": "function",
    "function": {
        "name": "analyze_text_file",
        "description": "Analyzes uploaded text files, answering questions, searching for specific words, summarizing content, and referencing pages for enhanced understanding.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "user_query": {
                    "type": "string",
                    "description": "A question or query related to the CSV data.",
                },
            },
            "required": ["user_query"],
            "additionalProperties": False,
        },
    }
}

random_pick_chunks_description = {
    "type": "function",
    "function": {
        "name": "random_pick_chunks",
        "description": "Randomly selects chunks of text from the vector database, providing an overview of the document. This function can be used to quickly gather a general understanding of the content by picking a random subset of text chunks.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "num_chunks": {
                    "type": "string",
                    "description": "The number of random chunks to retrieve from the vector database (Consider to retrieve at least 10).",
                },
                "file_to_filter": {
                    "type": "string",
                    "description": "Optionally, specify the name of a file from 'available files' to filter chunks. Provide 'None' to include all files.",
                }
            },
            "required": ["num_chunks", "file_to_filter"],
            "additionalProperties": False
        }
    }
}

retrieve_chunks_from_page_number_description = {
    "type": "function",
    "function": {
        "name": "retrieve_chunks_from_page_number",
        "description": "Fetches all text chunks corresponding to a specific page number from the vector database. This is useful for retrieving information associated with a particular page.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "page_number": {
                    "type": "string",
                    "description": "The page number to retrieve chunks for (e.g., '3').",
                },
                "file_to_filter": {
                    "type": "string",
                    "description": "Optionally, specify the name of a file from 'available files' to filter chunks. Provide 'None' to include all files.",
                }
            },
            "required": ["page_number", "file_to_filter"],
            "additionalProperties": False,
        },
    }
}

retrieve_chunks_containing_word_description = {
    "type": "function",
    "function": {
        "name": "retrieve_chunks_containing_word",
        "description": "Searches the vector database for text chunks containing a specific word or phrase. Useful for targeted keyword searches in the documents.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "word": {
                    "type": "string",
                    "description": "The word or phrase to search for.",
                },
                "file_to_filter": {
                    "type": "string",
                    "description": "Optionally, specify the name of a file from 'available files' to filter chunks. Provide 'None' to include all files.",
                }
            },
            "required": ["word", "file_to_filter"],
            "additionalProperties": False,
        },
    }
}

retrieve_chunks_by_index_description = {
    "type": "function",
    "function": {
        "name": "retrieve_chunks_by_index",
        "description": "Retrieves text chunks based on their unique chunk IDs. Use this function to fetch specific chunks identified by their index.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "chunk_ids": {
                    "type": "string",
                    "description": "A list of unique chunk IDs to retrieve. Provide this as a comma-separated list of integers in string format (e.g., '1,2,3').",
                },
                "file_to_filter": {
                    "type": "string",
                    "description": "Optionally, specify the name of a file from 'available files' to filter chunks. Provide 'None' to include all files.",
                }
            },
            "required": ["chunk_ids", "file_to_filter"],
            "additionalProperties": False,
        },
    }
}

similarity_search_description = {
    "type": "function",
    "function": {
        "name": "similarity_search",
        "description": "Performs a similarity search using a word or phrase input to find the most relevant text chunks. This function helps locate text similar to a specific query or concept.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "input_text": {
                    "type": "string",
                    "description": "A text input to be converted into an embedding vector.",
                },
                "top_n": {
                    "type": "string",
                    "description": "The number of top matching chunks to retrieve. (Consider to retrieve at least 5)",
                },
                "file_to_filter": {
                    "type": "string",
                    "description": "Optionally, specify the name of a file from 'available files' to filter chunks. Provide 'None' to include all files.",
                }
            },
            "required": ["input_text", "top_n", "file_to_filter"],
            "additionalProperties": False,
        },
    }
}

final_response_description = { 
    "type": "function",
    "function": {
        "name": "final_response",
        "description": "This function is called when all necessary information has been gathered through the tools, and the response is ready to be sent to the user.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "final_message": {
                    "type": "string",
                    "description": "This response describes the process of gathering information. It explains the tools used to retrieve the data. The response then provides a comprehensive and detailed answer to the user's query, referencing specific pages or filenames where the information was sourced. Finally, it concludes with follow-up questions to guide the user toward deeper insights or further exploration of the topic.",
                },
            },
            "required": ["final_message"],
            "additionalProperties": False,
        },
    }
}

########################### Main Agent ############################

def analyze_text_file(user_query):
    tools_descriptions = [final_response_description, random_pick_chunks_description, similarity_search_description, retrieve_chunks_by_index_description, retrieve_chunks_containing_word_description, retrieve_chunks_from_page_number_description]
    tools_functions = [final_response, random_pick_chunks, similarity_search, retrieve_chunks_by_index, retrieve_chunks_containing_word, retrieve_chunks_from_page_number]

    # load messages
    messages = load_messages(file_path="./.storage/.text_agent_messages.json")
    available_text_files = [f for f in os.listdir('./.storage') if f.endswith(('.pdf', '.txt'))]
    if len(messages) < 1:
        messages = insert_message(messages, "system", f"""You are a specialized text analysis system designed to analyze and extract insights from text files, such as PDFs. Your task is to extract information step-by-step using a range of tools, each tailored for specific types of queries. 

        The text from all 'available files' has been split into 300-word chunks, stored in a vector database. Each chunk has a unique `chunk_id` and is ordered sequentially.
                                  
        Effective Tool Usage Recommendations:
        1. Start random sampling for a high-level overview of content or to identify starting points for deeper analysis.
        2. Use the most specific tool (e.g., word search or page retrieval) to gather targeted results.
        3. Use similarity search when exact matches are unavailable or context needs to be inferred.
        4. Use chunk retrieval by ID or page to access additional context or subsequent lines when relevant information is found but incomplete.

        Once sufficient information has been gathered, Generate a response that first explains the process and tools used to retrieve the informationm then provide a long, comprehensive and detailed answer to the user's input, its neccesary to reference the specific pages numbers where the information was retrieved(Consider to mention filenames in case that you used multiple files). Conclude with relevant follow-up questions to guide the user toward deeper insights or further exploration of the topic.""")
    messages = insert_message(messages, "user", f"Answer this request -> {user_query} , considering that this are your 'available files': {available_text_files}")

    steps = 0
    max_steps = 10
    while steps < max_steps:
        response = generate_response("openai", "gpt-4-turbo", messages, tools_descriptions, tool_choice = "required", parallel_tool_calls=False)
        tool_result = execute_function(response, tools_functions)
        insert_tool_message(messages, response, tool_result)
        save_messages(messages, file_path="./.storage/.text_agent_messages.json")
        response_message = response.choices[0].message
        tool_calls = getattr(response_message, 'tool_calls', None)
        if tool_calls[0].function.name == "final_response":
            return tool_result

    return "I was unable to find a solution in time"