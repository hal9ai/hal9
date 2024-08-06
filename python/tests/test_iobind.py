import hal9 as h9

def test_save_empty_error():
  h9.save("messages", None)
  assert True
