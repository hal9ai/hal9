# IO

Convenience functions to process inputs and outputs.

## Input

`input (prompt, extract)` <br/><br/>

Wraps `input()` with an optional `extract` parameter to convert URLs to text

| Param | Type | Description |
| --- | --- | --- |
| prompt | <code>String</code> | A String, representing a default message before the input. |
| extract | <code>Boolean</code> | `False` to not extract the contents of URL as text, defaults to `True`. Requires the `textract` package to be installed.

## Load

`load (name, default)` <br/><br/>

Returns the contents of `name` file, `default` if it does not exist.

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The file name of the file to load. |
| default | <code>Object</code> | The default object when file does not exists. |

## Save

`save (name, contents, hidden)` <br/><br/>

Saves to `name` file the given `contents`.

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The file name of the file to save. |
| contents | <code>String</code> | The contents of the file to save. |
| hidden | <code>Boolean</code> | `True` to hide file from user, defaults to `False`.
