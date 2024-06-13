# Files

Convenience functions to load and save files.

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
| hidden | <code>Boolean</code> | `True` to make file visible user, defaults to `False`.