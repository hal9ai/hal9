import hal9 as h9

def test_can_save_messages():
  messages = ["test"]
  h9.save("messages", messages)

  assert messages == h9.load("messages", [])
