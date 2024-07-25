import hal9 as h9

def test_extract_html():
  expected = "Hello from HTML"
  value = h9.extract(f"""
This is a test with HTML

```html
{expected}
```
""", language = "html")
  assert value == expected + "\n"

def test_extract_multiple():
  value = h9.extract(f"""
This is a test with HTML

```html
Hello from HTML
```

```javascript
Hello from JS
```
""")
  expected = {
    "html": "Hello from HTML\n",
    "javascript": "Hello from JS\n",
  }
  assert value == expected

def test_extract_files():
  value = h9.extract(f"""
This is a test with HTML

```html filename=app.html
Hello from HTML
```

```javascript filename=code.js
Hello from JS
```
""")
  expected = {
    "app.html": "Hello from HTML\n",
    "code.js": "Hello from JS\n",
  }
  assert value == expected

def test_extract_files_defaults():
  value = h9.extract(f"""
This is a test with HTML

```html filename=app.html
Hello from HTML
```
""", default = {
  "app.html": "Hello\n",
  "code.js": "Hello from JS\n"
})
  expected = {
    "app.html": "Hello from HTML\n",
    "code.js": "Hello from JS\n",
  }
  assert value == expected
