#' @importFrom shiny tagList singleton tags p
NULL

#' @export
widgetDateDB <- function(inputId, label, value = NULL, isRequired = FALSE, readOnly = FALSE, onlyDataEntry = FALSE, defaultVal = lubridate::today()) {

  isRequired <- as.integer(isRequired)
  readOnly <- as.integer(readOnly)
  dataEntry <- as.integer(onlyDataEntry)

  if (!is.null(defaultVal) && (is.null(value)))
    value <- as.character(defaultVal)

  if (!is.null(value) && !lubridate::is.Date(as.Date(value))) stop(paste0("id = ", inputId, ": Please enter correct date."))

  if (dataEntry == 1) {
    readOnly <- 0
    value <- ""
  }

  shiny::addResourcePath("js", system.file("js", package = "shinyDBWidget"))
  shiny::addResourcePath("css", system.file("css", package = "shinyDBWidget"))
  shiny::addResourcePath("datepick", system.file("shared/datepick", package = "shinyDBWidget"))

  shiny::tagList(shiny::singleton(tags$head(
    tags$link(rel="stylesheet", href="css/widgetDB.css", type="text/css", media="all"),
    tags$link(rel="stylesheet", href="datepick/jquery.datepick.css", type="text/css", media="all"),
    tags$script(src="datepick/jquery.plugin.min.js"),
    tags$script(src="datepick/jquery.datepick.min.js"),
    tags$script(src="js/widgetDateDB.js")
  )),
  tags$body(tags$div(id = inputId, class = "widgetDateDB widgetDB",
                     tags$p(tags$b(label)),
                     tags$div(class = "divNoEdit", `data-isReqd` = isRequired, `data-readOnly` = readOnly, `data-onlyDataEntry` = dataEntry, p(value)),
                     tags$div(class = "divEdit",
                              tags$input(class = "tbEdit", type = "text"),
                     tags$div(class = "divBtn",
                              tags$input(type = "button", class = "btn btnUpdate", value = "Update"),
                              tags$input(type = "button", class = "btnCancel btn", value = "Cancel"))),
                     tags$div(class = "divVal"))))
}


#' @export
updateWidgetDateDB <- function(session, inputId, isUpdatedInDB = FALSE, value = NULL) {

  # This function will take either the isUpdatedInDB or value or both of them and change the widget accordingly:
  # If isUpdatedInDB is true then it will revert back the color of border of the .divNoEdit p to gray. If false no change will be made. isUpdatedInDB will come from the server.R at the time when the edited values have entered into the DB successfully.
  # If value is not null, then it will be used to change the .divNoEdit p value into the new value, also the value of .tbEdit is changed into "".

  # This function will be called from server and will make changes to the widget denoted by the inputId accordingly.
  # It will make use of the session$sendCustomMessage and Shiny.addCustomMessageHandler

  # session$sendCustomMessage(type = "name", msg)
  #browser()

  if (!is.null(value) && !isDate(value)) {
    msg <- "Date required on update"
    value <- ""
  } else msg <- ""

  session$sendCustomMessage(type = "sendToWidgetDateDB", jsonlite::toJSON(list(id = inputId, isUpdatedInDB = isUpdatedInDB, value = value, msg = msg)))

}

#' @export
validateWidgetDateDB <- function(session, input, inputId, condition, message) {

  # The problem with the shiny::validate is that it has to be placed inside a reactive object and that it will output the message inside the output component.

  # There will be a tremendous effort required if I want to add validation along with the constructor function of the widget, as the validation code will have to be translated to javascript before running it, it will need a new DSL, which is beyond me. I will put the validation code in server side and will pass the meaasge using session$sendCustomMessage and will handle in Shiny.addCustomMessageHandler. The problem will be to make this function run as soon as the input$inputId changes and to make the input$inputId value chage to NULL if validation is found to be wrong.

  # condition: it will be denoted as a valid R expression which will output TRUE/FALSE, if TRUE it will be validated else it will be invalidated, with message passed to the javascript routine and printed in divVal div of the widget and input$inputId changed to NULL.
  #browser()

  if (!isDate(input[[inputId]])) return(NULL)

  condition <- substitute(condition)

  isValidated <- eval(condition, envir = list(`.` = input[[inputId]]), enclos = parent.frame())

  if (isValidated == FALSE) {
    session$sendCustomMessage(type = "validateWidgetDateDB", jsonlite::toJSON(list(id = inputId, message = message)))
    #input[[inputId]] <- NULL
  }

  return(NULL)
}

#' @export
registerWidgetDateDB <- function(fun = function(data, ...) return(data)) {
  environment(fun) <- parent.frame()
  shiny::registerInputHandler(type = "shinyDBWidget.widgetDateDBBinding", fun, force = TRUE)
}
