import pandas as pd
from utils import generate_response, load_messages, insert_message, execute_function, save_messages, insert_tool_message
import traceback
import os
import shutil

########################### Functions ##########################

def load_data(file_path):
    return pd.read_csv(file_path)

# Data Overview
def data_overview(csv_path):
    df = load_data(csv_path)
    table_name = "Dataset Overview"
    row_count = df.shape[0]
    column_count = df.shape[1]
    columns_info = "\n".join([f"- {col}: {df[col].dtype}" for col in df.columns])
    data_preview = df.head().to_string(index=False)
    
    return f"""
    **Data Overview**
    - Table Name: {table_name}
    - Number of Rows: {row_count}
    - Number of Columns: {column_count}
    - Column Names and Data Types:
    {columns_info}
    
    **Data Preview:**
    {data_preview}"""

# Numeric Columns Summary 
def numeric_columns_summary(csv_path):
    df = load_data(csv_path)
    numeric_columns = df.select_dtypes(include=['number']).columns
    numeric_stats = ""
    
    for col in numeric_columns:
        stats = df[col].describe(percentiles=[.25, .5, .75])
        numeric_stats += f"\n- {col}:\n  Mean: {stats['mean']}\n  Median: {stats['50%']}\n"\
                         f"  Std Dev: {stats['std']}\n  Min: {stats['min']}\n  Max: {stats['max']}\n"\
                         f"  25th, 50th, 75th percentiles: {stats['25%']}, {stats['50%']}, {stats['75%']}\n"

    return f"""
    **Numeric Columns Summary**

    **Numeric Columns:**
    {numeric_stats}
    """

# Categorical Columns Summary
def categorical_summary(csv_path):
    df = load_data(csv_path)
    categorical_columns = df.select_dtypes(exclude=['number']).columns
    categorical_stats = ""
    
    for col in categorical_columns:
        value_counts = df[col].value_counts()
        mode = value_counts.idxmax()
        mode_freq = value_counts.max()
        categorical_stats += f"\n- {col}:\n  Unique values: {df[col].nunique()}\n"\
                             f"  Mode: {mode} (Frequency: {mode_freq})\n  Frequencies:\n{value_counts.to_string()}\n"

    return f"""
    **Categorical Columns Summary**

    **Categorical Columns:**
    {categorical_stats}
    """

# Missing Values Analysis
def missing_values_analysis(csv_path):
    df = load_data(csv_path)
    missing_values_info = df.isnull().sum()
    missing_percentage = (df.isnull().mean() * 100).round(2)
    
    missing_summary = "\n".join([f"- {col}: {missing_values_info[col]} ({missing_percentage[col]}%)" 
                                 for col in df.columns if missing_values_info[col] > 0])

    return f"""
    **Missing Values Analysis**

    **Columns with Missing Values:**
    {missing_summary}
    """

# Single Column Analysis
def column_analysis(csv_path, column_name):
    df = load_data(csv_path)
    if column_name not in df.columns:
        return f"Column '{column_name}' does not exist in the dataset."

    col_data = df[column_name]
    col_info = f"\n- Column: {column_name}\n  Data Type: {col_data.dtype}\n  Unique Values: {col_data.nunique()}"
    
    if pd.api.types.is_numeric_dtype(col_data):
        col_info += f"\n  Mean: {col_data.mean():.2f}\n  Std Dev: {col_data.std():.2f}\n"\
                    f"  Min: {col_data.min()}\n  Max: {col_data.max()}\n"
    else:
        value_counts = col_data.value_counts()
        mode = value_counts.idxmax()
        mode_freq = value_counts.max()
        col_info += f"\n  Mode: {mode} (Frequency: {mode_freq})\n  Frequencies:\n{value_counts.to_string()}\n"
    
    return f"""
    **Single Column Analysis: {column_name}**

    {col_info}
    """
def generate_subdataframe(csv_path, code):
        context = {}
        context['csv_path'] = csv_path
        try:
            exec(code, context)
            return context['result']
        except Exception as e:
            return (f"Error executing the code': {e}")
        
def generate_plot(csv_path, code):
        context = {}
        context['csv_path'] = csv_path
        try:
            exec(code, context)
            return context['result']
        except Exception as e:
            return (f"Error executing the code': {e}")
        
def generate_dashboard(csv_path, code):
    context = {}
    context['csv_path'] = csv_path
    directory = "./.storage/app.py"  # Target directory for the Python file
    file_name = os.path.basename(csv_path)
    
    try:
        # Execute the provided Python code
        exec(code, context)
        code = code.replace(csv_path, file_name)
        # Ensure the target directory exists
        if not os.path.exists(directory):
            os.makedirs(directory)

        # Write the code to the app.py file
        python_file_path = os.path.join(directory, "app.py")
        with open(python_file_path, 'w') as file:
            file.write(code)

        # Copy the CSV file to the same directory
        csv_destination = os.path.join(directory, os.path.basename(csv_path))
        shutil.copy(csv_path, csv_destination)

        return "The app is running properly"
    except Exception as e:
        # Handle exceptions and provide a detailed traceback
        tb = traceback.format_exc()
        relevant_error_info = tb.splitlines()
        last_line = relevant_error_info[-1]
        return f"Unable to run the dashboard generated, an error has occurred -> {last_line} ... Complete traceback: {tb}"

def generate_print_and_filter(csv_path, code):
        context = {}
        context['csv_path'] = csv_path
        try:
            exec(code, context)
            return context['result']
        except Exception as e:
            return (f"Error executing the code': {e}")
        
def fix_python_code(csv_path, code):
    context = {}
    context['csv_path'] = csv_path
    directory = "./.storage/app.py"  # Target directory for the Python file
    file_name = os.path.basename(csv_path)
    code = code.replace(csv_path, file_name)
    try:
        # Execute the provided Python code
        exec(code, context)
        code = code.replace(csv_path, file_name)
        # If the code contains "streamlit", handle folder creation and file operations
        if "streamlit" in code:
            # Ensure the target directory exists
            if not os.path.exists(directory):
                os.makedirs(directory)
            
            # Write the code to the app.py file
            python_file_path = os.path.join(directory, "app.py")
            with open(python_file_path, 'w') as file:
                file.write(code)
            
            # Move the CSV file to the same directory
            csv_destination = os.path.join(directory, os.path.basename(csv_path))
            shutil.copy(csv_path, csv_destination)
            
            return "The app is running properly"
        
        return "The code now works perfectly"
    except Exception as e:
        # Handle exceptions and provide a detailed traceback
        tb = traceback.format_exc()
        relevant_error_info = tb.splitlines()
        last_line = relevant_error_info[-1]
        return f"An error has occurred again -> {last_line} ... Complete traceback: {tb}"
        
def final_response(final_message):
    return final_message

########################### Descriptions ########################## 

analyze_csv_description = {
    "type": "function",
    "function": {
        "name": "analyze_csv",
        "description": "Performs data analysis on the provided CSV file. It can answer questions related to the data, generate insights, summarize key metrics, and create visualizations such as plots to help the user better understand the content. This tool supports both descriptive statistics and data-driven insights.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "csv_path": {
                    "type": "string",
                    "description": "The path to the CSV file that will be analyzed",
                },
                "user_query": {
                    "type": "string",
                    "description": "A question or query related to the CSV data.",
                },
            },
            "required": ["csv_path", "user_query"],
            "additionalProperties": False,
        },
    }
}

data_overview_description = {
    "type": "function",
    "function": {
        "name": "data_overview",
        "description": "Provides an overview of the dataset, including the table name, row and column counts, data types of each column, and a preview of the first few rows, your first step to understand the data.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "csv_path": {
                    "type": "string",
                    "description": "The path to the CSV file to be summarized.",
                },
            },
            "required": ["csv_path"],
            "additionalProperties": False,
        },
    }
}

numeric_columns_summary_description = {
    "type": "function",
    "function": {
        "name": "numeric_columns_summary",
        "description": "Generates a summary of all numeric columns in the provided DataFrame, use just in case that requires deeper information, including key statistics such as mean, median, standard deviation, and percentiles.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "csv_path": {
                    "type": "string",
                    "description": "The path to the CSV file to be summarized.",
                },
            },
            "required": ["csv_path"],
            "additionalProperties": False,
        },
    }
}

categorical_summary_description = {
    "type": "function",
    "function": {
        "name": "categorical_summary",
        "description": "Summarizes categorical columns in the provided DataFrame, use just in case that requires deeper information, by reporting unique values, mode, frequency, and value counts for each categorical column.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "csv_path": {
                    "type": "string",
                    "description": "The path to the CSV file to be summarized.",
                },
            },
            "required": ["csv_path"],
            "additionalProperties": False,
        },
    }
}

missing_values_analysis_description = {
    "type": "function",
    "function": {
        "name": "missing_values_analysis",
        "description": "Analyzes the DataFrame for missing values, providing counts and percentages of missing values for each column, use just in case that is been asked for missing values report.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "csv_path": {
                    "type": "string",
                    "description": "The path to the CSV file to be summarized.",
                },
            },
            "required": ["csv_path"],
            "additionalProperties": False,
        },
    }
}

column_analysis_description = {
    "type": "function",
    "function": {
        "name": "column_analysis",
        "description": "Analyzes a specific column in a CSV dataset, use just in case that is been asked about and specific column, providing details such as data type, unique values, mean, standard deviation, minimum, and maximum values for numeric columns, or mode and frequency counts for categorical columns.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "csv_path": {
                    "type": "string",
                    "description": "The file path to the CSV file that will be read into a DataFrame."
                },
                "column_name": {
                    "type": "string",
                    "description": "The name of the column to analyze within the dataset."
                },
            },
            "required": ["csv_path", "column_name"],
            "additionalProperties": False,
        },
    }
}

generate_subdataframe_description = {
    "type": "function",
    "function": {
        "name": "generate_subdataframe",
        "description": "Executes custom Python code to extract specific information from a CSV file. The code provided must load the CSV data and store the subdataframe in path './.storage/'",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "csv_path": {
                    "type": "string",
                    "description": "The file path to the CSV file that will be loaded into a DataFrame for processing."
                },
                "code": {
                    "type": "string",
                    "description": "A string containing the Python code to be executed. This code should be a complete script including imports, the dataframe must load the CSV data from the 'csv_path' parameter, perform necessary operations, and store the result in a new CSV into the path './.storage/'"
                }
            },
            "required": ["csv_path", "code"],
            "additionalProperties": False
        }
    }
}

generate_plot_description = {
    "type": "function",
    "function": {
        "name": "generate_plot",
        "description": "Executes custom Python code to process data from a CSV file and generate a plot from plotly Express and export a final image with an adapted size based on amount of data with Kaleido as JPEG into the path './.storage/, be sure of add numbers into the bars and lines of each plot.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "csv_path": {
                    "type": "string",
                    "description": "The file path to the CSV file that will be read and used for generating a plot."
                },
                "code": {
                    "type": "string",
                    "description": "A string containing Python code to execute. This code should be a complete script including imports, the dataframe must load the CSV data from the 'csv_path' parameter, perform any necessary analysis or transformations, and generate a great plot, with labels of the numbers in each line or bar, finally store the plot image with Kaleido and save the filename into a 'result' variable."
                }
            },
            "required": ["csv_path", "code"],
            "additionalProperties": False
        }
    }
}

generate_dashboard_description = {
    "type": "function",
    "function": {
        "name": "generate_dashboard",
        "description": "Generates a Streamlit app to present a dashboard with filters and plots from Plotly Express. The code must load the CSV data from the 'csv_path' parameter",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "csv_path": {
                    "type": "string",
                    "description": "The path to the CSV file that will be used to generate the dashboard data."
                },
                "code": {
                    "type": "string",
                    "description": "A string containing Python code to execute. This code should be a complete script including imports, any necessary calculations, streamlit components and finally a plot or table display"
                }
            },
            "required": ["csv_path", "code"],
            "additionalProperties": False
        }
    }
}

generate_print_and_filter_description = {
    "type": "function",
    "function": {
        "name": "generate_print_and_filter",
        "description": "Executes custom Python code to process data from a CSV file and generate a print statement that answer and specific request, the string to be printed is stored into a variable 'result'",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "csv_path": {
                    "type": "string",
                    "description": "The path to the CSV file that will be used to generate the response."
                },
                "code": {
                    "type": "string",
                    "description": "A string containing Python code to execute. This code should be a complete script including imports,The code must load the CSV data from the 'csv_path' parameter, any necessary calculations, and finally store the string to be print into a 'result' variable"
                }
            },
            "required": ["csv_path", "code"],
            "additionalProperties": False
        }
    }
}

fix_python_code_description = {
    "type": "function",
    "function": {
        "name": "fix_python_code",
        "description": "Read carefully the last python code generated and the error returned and rewrite the code to fix the error, if is necessary before of use this tool get a deeper review of the data that could fail",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "csv_path": {
                    "type": "string",
                    "description": "The path to the CSV file that will be used to generate the response."
                },
                "code": {
                    "type": "string",
                    "description": "A string containing the fixed Python code to execute. Again is a complete script including imports, and solving the error"
                }
            },
            "required": ["csv_path", "code"],
            "additionalProperties": False
        }
    }
}

final_response_description = { 
    "type": "function",
    "function": {
        "name": "final_response",
        "description": "This function is called when all necessary information has been gathered through the tools, and the response is ready to be sent to the user. It finalizes the process and delivers the results in a clear and concise message.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "final_message": {
                    "type": "string",
                    "description": "A clear and concise message that in simple terms mentions all the tools called to obtain the information neccesary. It explains how the information was gathered and whats the final insight.",
                },
            },
            "required": ["final_message"],
            "additionalProperties": False,
        },
    }
}


########################### Main Agent ############################

def analyze_csv(csv_path, user_query):
    tools_descriptions = [data_overview_description, numeric_columns_summary_description, categorical_summary_description, missing_values_analysis_description, column_analysis_description, generate_dashboard_description, generate_plot_description, generate_subdataframe_description, generate_print_and_filter_description, fix_python_code_description, final_response_description]
    tools_functions = [data_overview, numeric_columns_summary, categorical_summary, missing_values_analysis, column_analysis, generate_dashboard, generate_plot, generate_subdataframe, generate_print_and_filter, fix_python_code, final_response]

    # load messages
    messages = load_messages(file_path="./.storage/.csv_messages.json")

    if len(messages) < 1:
        messages = insert_message(messages, "system", f"""You are a data analysis system specialized in carefully analyzing CSV files using a serie of tools. 
                            Approach this task with a step-by-step methodology using the minimum necessary tools,
                            examining the data(with the data_overview tool, limitate the numerical and categorical tools just for specific questions) thoroughly 
                            before moving on to generate any code(dashboard, print, plots, subdataframes) . Avoid making assumptions about columns, data formats.
                            If a tool return and error use your fix_python_code tool.
                            Once you have collected all the required information to solve the user input generate a final response that starts with 'Final Response:'.""")
    messages = insert_message(messages, "user", f"Answer this request -> {user_query} , with this CSV_path = '{csv_path}'")

    steps = 0
    max_steps = 10
    while steps < max_steps:
        response = generate_response("openai", "o3-mini", messages, tools_descriptions, tool_choice = "required")
        tool_result = execute_function(response, tools_functions)
        insert_tool_message(messages, response, tool_result)
        save_messages(messages, file_path="./.storage/.csv_messages.json")
        response_message = response.choices[0].message
        tool_calls = getattr(response_message, 'tool_calls', None)
        if tool_calls[0].function.name == "final_response":
            return tool_result

    return "I was unable to find a solution in time"