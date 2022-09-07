# How to update this package

This source code is generated using the content of `hal9ai/scripts` folder.

Update this package following the steps:

1. Open `hal9.proj` on RStudio.
2. Load the package with `devtools::load_all()` or `pkgloag::load_all()`.
3. Run `data-raw/build_components.R`. This will update `R/sysdata.rda` (the parsed metadata on hal9 steps) based on `hal9ai/scripts/components.json`.
4. Run `data-raw/build_steps.R`. This will build the R source code for every `h9_`.
5. Run `devtools::document()`.
