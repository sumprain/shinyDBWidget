#' @export
widgetSelectDB <- function(inputId, label, choices = NULL, textCol = NULL, valCol = NULL, selectedText = NULL, isRequired = FALSE, readOnly = FALSE, onlyDataEntry = FALSE) {

  # choices, textCol, outputCol, selectedText will be used when the filling of select widget is from client side, else they will be null and will be present in update function

  isRequired <- as.integer(isRequired)
  readOnly <- as.integer(readOnly)
  dataEntry <- as.integer(onlyDataEntry)

  choices <- nullToBlank(choices)
  textCol <- nullToBlank(textCol)
  valCol <- nullToBlank(valCol)
  selectedText <- nullToBlank(selectedText)

  if (dataEntry == 1) {
    readOnly <- 0
  }

  if (inherits(choices, "data.frame")) {
    choices <- convertDf(choices, valCol = valCol, textCol = textCol)
    #browser()
    #'[{"val":1,"text":"a"},{"val":2,"text":"b"},{"val":3,"text":"c"}]'
    htmlNoEdit <- tags$div(class = "divNoEdit", `data-choices` = jsonlite::toJSON(choices), `data-selectedText` = selectedText, `data-isReqd` = isRequired, `data-readOnly` = readOnly, `data-onlyDataEntry` = dataEntry, p(selectedText))
  } else {
    htmlNoEdit <- tags$div(class = "divNoEdit", `data-choices` = '', `data-selectedText` = '', `data-isReqd` = isRequired, `data-readOnly` = readOnly, `data-onlyDataEntry` = dataEntry, p(selectedText))
  }

  shiny::addResourcePath("js", system.file("js", package = "shinyDBWidget"))
  shiny::addResourcePath("css", system.file("css", package = "shinyDBWidget"))

  tagList(singleton(tags$head(
    tags$link(rel="stylesheet", href="css/widgetDB.css", type="text/css", media="all"),
    tags$script(src="js/widgetSelectDB.js")
  )),
  tags$body(tags$div(id = inputId, class = "widgetSelectDB widgetDB",
                     tags$p(tags$b(label)),
                     htmlNoEdit,
                     tags$div(class = "divEdit",
                              tags$select(class = "tbEdit"),
                     tags$div(class = "divBtn",
                              tags$input(type = "button", class = "btn btnUpdate", value = "Update"),
                              tags$input(type = "button", class = "btnCancel btn", value = "Cancel"))),
                     tags$div(class = "divVal"))))
}

#' @export
updateWidgetSelectDB <- function(session, inputId, isUpdatedInDB = FALSE, choices = NULL, textCol = NULL, valCol = NULL, selectedText = NULL) {

  # This function will take either the isUpdatedInDB or value or both of them and change the widget accordingly:
  # If isUpdatedInDB is true then it will revert back the color of border of the .divNoEdit p to gray. If false no change will be made. isUpdatedInDB will come from the server.R at the time when the edited values have entered into the DB successfully.
  # If value is not null, then it will be used to change the .divNoEdit p value into the new value, also the value of .tbEdit is changed into "".

  # This function will be called from server and will make changes to the widget denoted by the inputId accordingly.
  # It will make use of the session$sendCustomMessage and Shiny.addCustomMessageHandler

  # session$sendCustomMessage(type = "name", msg)
  #browser()

  choices <- nullToBlank(choices)
  textCol <- nullToBlank(textCol)
  valCol <- nullToBlank(valCol)
  selectedText <- nullToBlank(selectedText)

  if (inherits(choices, "data.frame"))
    choices <- convertDf(choices, valCol = valCol, textCol = textCol)

  session$sendCustomMessage(type = "sendToWidgetSelectDB", jsonlite::toJSON(list(id = inputId, isUpdatedInDB = isUpdatedInDB, choices = choices, selectedText = selectedText)))

}

#' @export
validateWidgetSelectDB <- function(session, input, inputId, condition, message) {

  # The problem with the shiny::validate is that it has to be placed inside a reactive object and that it will output the message inside the output component.

  # There will be a tremendous effort required if I want to add validation along with the constructor function of the widget, as the validation code will have to be translated to javascript before running it, it will need a new DSL, which is beyond me. I will put the validation code in server side and will pass the meaasge using session$sendCustomMessage and will handle in Shiny.addCustomMessageHandler. The problem will be to make this function run as soon as the input$inputId changes and to make the input$inputId value chage to NULL if validation is found to be wrong. It can be done with observe ({input$...; validate...})

  # condition: it will be denoted as a valid R expression which will output TRUE/FALSE, if TRUE it will be validated else it will be invalidated, with message passed to the javascript routine and printed in divVal div of the widget and input$inputId changed to NULL.

  condition <- substitute(condition)

  isValidated <- eval(condition, envir = list(`.` = input[[inputId]]), enclos = parent.frame())

  if (isValidated == FALSE) {
    session$sendCustomMessage(type = "validateWidgetSelectDB", jsonlite::toJSON(list(id = inputId, message = message)))
    #input[[inputId]] <- NULL
  }

  return(NULL)
}

#' @export
registerWidgetSelectDB <- function(fun = function(x, ...) return(as.character(x))) {
  environment(fun) <- parent.frame()
  shiny::registerInputHandler(type = "shinyDBWidget.widgetSelectDBBinding", fun, force = TRUE)
}
