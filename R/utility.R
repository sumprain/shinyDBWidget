
# Checks if value can be coerced into date
isDate <- function(x) {
  tt <- try(as.Date(x), silent = TRUE)
  if (inherits(tt, "Date"))
    return(TRUE)
  else
    return(FALSE)
}

# Checks if value can be coerced into time
isTime <- function(x) {

  patternTime = "([01]?[0-9]|2[0-3]):[0-5][0-9]"

  res <- grepl(patternTime, x)

  return(res)

}

# convert NULL into blank string

nullToBlank <- function(x, replace = "") {
  if (is.null(x)) {
    x <- replace
  }
  x
}


# modify dataframe to include valCol and textCol

convertDf <- function(df, valCol, textCol) {

  df <- df[, c(valCol, textCol)]

  colnames(df) <- c("val", "text")

  df
}
