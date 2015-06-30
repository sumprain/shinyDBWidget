# Fill up Imports in DESCRIPTION

devtools::use_package("shiny")
devtools::use_package("lubridate")
devtools::use_package("jsonlite")
devtools::use_package("RSelenium", "Suggests")

# namespace populate

devtools::document()

# add test suite

devtools::add_test_infrastructure()
