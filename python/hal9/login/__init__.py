import os
from typing import NamedTuple, Optional
import streamlit.components.v1 as components

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
# (This is, of course, optional - there are innumerable ways to manage your
# release process.)
_RELEASE = True

if not _RELEASE:
    _component_func = components.declare_component(
        "hal9-login",
        url="http://localhost:3001",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("hal9-login", path=build_dir)


class LoginInfo(NamedTuple):
    user: Optional[str] = None


def login(name, key=None):
    component_value = _component_func(name=name, key=key, default={"user": None})
    return LoginInfo(**component_value)


if not _RELEASE:
    import streamlit as st

    login_info = login("World")
    if (login_info.user):
        st.write('Hello', login_info.user)
    else:
        st.write('Please login before using app')
