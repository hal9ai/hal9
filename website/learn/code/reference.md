# Reference Functions

## Code

Convenience functions to process code.

### Extract
`extract(markdown, language)` <br/><br/>
Extracts code blocks from `markdown` text.

When no `language` is specified, a dictionary is retrieved with all code blocks grouped by lanuage. If the blocks contain `filename` header, a dictionary of file names is retrieve instead. The `default` can contain a dictionary of files to use as defaults.

| Param | Type | Description |
| --- | --- | --- |
| markdown | <code>String</code> | The markdown to extract blocks from. |
| language | <code>String</code> | The language of the code blocks to extract. |
| default | <code>Any</code> | The default value when code not found, defaults to `None`. |

## Complete

Convenience functions to handle LLM completions

### Complete
`complete(completion, messages, tools, show)` <br/><br/>
Finishes completing the completions by printing them, appending messages, or handling tools.

| Param | Type | Description |
| --- | --- | --- |
| completion | <code>String</code> | The completions form the LLM. |
| messages | <code>Array</code> | Messages to append replies to, defaults to `[]`. |
| tools | <code>Array</code> | An array of functions to use as tools, defaults `[]`. |
| show | <code>Bool</code> | Print the completions? Defaults to `True`. |

### Describe
`describe(funcs)` <br/><br/>
Describes an array of functions with descriptions, parameters and types. Useful when completing chats.

| Param | Type | Description |
| --- | --- | --- |
| functions | <code>Array</code> | An array of functions to describe. |

## Events

Functions to log events.

### Event
`event(name, details)` <br/><br/>
Appends the `name` event with `details` details.

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the event. Use kebab-case naming conventions. |
| details | <code>String</code> | Details particular to this event. |

## IO

Convenience functions to process inputs and outputs.

### Input

`input (prompt, extract)` <br/><br/>

Wraps `input()` with an optional `extract` parameter to convert URLs to text

| Param | Type | Description |
| --- | --- | --- |
| prompt | <code>String</code> | A String, representing a default message before the input. |
| extract | <code>Boolean</code> | `True` to extract the contents of URL as text, defaults to `False`. Requires the `textract` package to be installed.

### Load

`load (name, default, access)` <br/><br/>

Reload the contents stored with `remember()` with `name`.

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The file name of the file to load. |
| default | <code>Object</code> | The default object when file does not exists. |

Returns the contents of `name` file, `default` if it does not exist.

### Save

`save (name, contents, hidden, files, encoding, access)` <br/><br/>

Saves as `name` the given `contents`. Useful to share binary files with users.

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The file name of the file to save. |
| contents | <code>String</code> | The contents of the file to save. |
| hidden | <code>Boolean</code> | `True` to hide file from user, defaults to `False`. |
| files | <code>Dictionary</code> | A dictionary mapping additional file names to contents to save. |
| encoding | <code>String</code> | The encoding to use when saving text. |
| access | <code>String</code> | Modify access level to `user` or `shared`. Defaults to `storage` to save file for current session. The `shared` level allows any user using this chat to access this file. The `user` level allows other sessions for the same user to access the file. |

Saves to `name` file the given `contents` under the `.storage` subfolder. An appropriate extension for the `name` will be generated based on the type of `contents`.

## URL

Convenience functions to process URL prompts.

### Is

`is_url(prompt)` <br/><br/>
Tests if `prompt` is a URL.

| Param | Type | Description |
| --- | --- | --- |
| prompt | <code>String</code> | The prompt to test. |

### Contents

`url_contents(prompt)` <br/><br/>
Retrieves the contents from a `prompt` that is a URL.

| Param | Type | Description |
| --- | --- | --- |
| prompt | <code>String</code> | The prompt to retrieve. |

