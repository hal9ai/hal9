# IO

Convenience functions to process inputs and outputs.

## Input

`input (prompt, extract)` <br/><br/>

Wraps `input()` with an optional `extract` parameter to convert URLs to text

| Param | Type | Description |
| --- | --- | --- |
| prompt | <code>String</code> | A String, representing a default message before the input. |
| extract | <code>Boolean</code> | `True` to extract the contents of URL as text, defaults to `False`. Requires the `textract` package to be installed.

## Load

`load (name, default, access)` <br/><br/>

Reload the contents stored with `remember()` with `name`.

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The file name of the file to load. |
| default | <code>Object</code> | The default object when file does not exists. |

Returns the contents of `name` file, `default` if it does not exist.

## Save

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
