
This path contains shared code between the application and worker roles. It's mostly used to execute arbitrary pipelines and parse script headers.

The main components worth highlighting follow:
- **Executors:** The [executors](executors/) path provides different strategies on executing pipeline steps. A local one to simply run a step, a cached one which persists the output with a hash of the inputs, and a remote executor that delegates execution to a worker role.
- **Interpreters:** The [interpreters](pipeleine.js) path contains language interpreters that run in JavaScript to support Markdown and SQL pipeline steps. 
- **Pipeline:** The [pipeline.js](pipeleine.js) file is perhaps the most important file in the project, it contains support to manipulate and execute a pipeline, while also providing status-callbacks to the user interface and parsing scripts as needed. The way this structure is defined favors UI operations, to avoid loosing context when steps are inserted or porameters modified.
- **Sinppets:** The [snippets.js](snippets.js) file provides support for parsing YAML headers from the scripts and extract relevant information from them like parameters.
- **Utils:** The [utils](utils/) path provides utility functions to say, clone objects, detect data frames, and some basic data frame operations.
