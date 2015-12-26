library(shiny)
library(shinyDBWidget)

shinyUI(fluidPage(
  titlePanel("Hello widget"),
  widgetTextDB(inputId = "xxx", label = "Name", value = "suman"),
  verbatimTextOutput(outputId = "test"),
  widgetSelectDB(inputId = "sel", label = "Select ...", choices = data.frame(v = c(1, 2, 3), t = letters[1:3], stringsAsFactors = FALSE),textCol = "t",valCol = "v"),
  widgetDateDB(inputId = "dat", label = "Date ...")
))


# Shiny.inputBindings.register(widgetTextDBBinding, 'shinyDBWidget.widgetTextDBBinding');
registerWidgetTextDB()
registerWidgetSelectDB()
registerWidgetDateDB()
