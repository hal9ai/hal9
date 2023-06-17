import os
import streamlit.components.v1 as components

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
# (This is, of course, optional - there are innumerable ways to manage your
# release process.)
_RELEASE = False

if not _RELEASE:
    _component_func = components.declare_component(
        "hal9-login",
        url="http://localhost:3001",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("hal9-login", path=build_dir)


def my_component(name, key=None):
    component_value = _component_func(name=name, key=key, default=0)
    return component_value


if not _RELEASE:
    import streamlit as st

    my_component("World")
