import hal9 as h9

def test_is_url():
  assert h9.is_url("https://google.com")

def test_is_url_not():
  assert not h9.is_url("Hi there!")

def test_is_multipline():
  assert h9.is_url("https://google.com\n\n")
