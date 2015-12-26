shinyServer(function(input, output, session)({

  output$test <- renderPrint(input$dat)
}))
