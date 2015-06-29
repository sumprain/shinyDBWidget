library(shiny)
library(shinyDBWidget)

shinyUI(fluidPage(
  titlePanel("Hello widget"),
  widgetTextDB(inputId = "xxx", label = "Name", value = "suman"),
  verbatimTextOutput(outputId = "test")

))


# Shiny.inputBindings.register(widgetTextDBBinding, 'shinyDBWidget.widgetTextDBBinding');
#registerWidgetTextDB()
