$(document).ready(function() {

  function initiateWidgetNumericDB(widget) {
    widget = $(widget);

    if (widget.find('.divNoEdit').data('onlydataentry') == 1) {
      widget.find('.divEdit').show();
      widget.find('.divNoEdit').hide();
    } else {
      widget.find('.divEdit').hide();
    }


    if (widget.find('.divNoEdit').data('readonly') == 1) {
      widget.find('.divNoEdit').css('background-color', '#E7E7E7');
    }

    if (widget.find('.divNoEdit').data('isreqd') == 1) {
      if (widget.find('.divNoEdit p').text() === '') {
        widget.find('.divVal').append('<p>Text cannot be missing</p>');
      }
    }

    if (! jQuery.isNumeric(widget.find('.divNoEdit p').text())) {
      widget.find('.divVal').append('<p>Numeric value required</p>');
    }
  }

  // var inputTxt = prompt('Enter text: ', '');
  //$('.divNoEdit p').text(inputTxt);

  //var initVal = $(document).find('.divNoEdit p').text();
  //var finalVal = '';

  $(document).on('dblclick', '.widgetNumericDB .divNoEdit', function(evt) {
    var mother = $(this).parents('.widgetNumericDB');
      if (mother.find('.divNoEdit').data('readonly') == 0) {
        mother.find('.divNoEdit').hide(150);
        mother.find('.divEdit').show(150);
      }
      mother.find('.tbEdit').val(mother.find('.divNoEdit p').text());
      if (mother.find('.divNoEdit').data('readonly') == 1) {
        mother.find('.btnUpdate').trigger('click');
      }    //initVal = mother.find('.divNoEdit p').text();

  }); // end of double click

  $(document).on('click', '.widgetNumericDB .btnUpdate', function(evt) {

    var mother = $(this).parents('.widgetNumericDB');
    //var el = $(evt.target).parents('.widget');
    var finalVal = mother.find('.tbEdit').val();

    if (!jQuery.isNumeric(finalVal)) {
      mother.find('.divVal').append('<p>Numeric value required</p>');
      return null;
    } else {
      mother.find('.divVal').empty();
    }

    if (mother.find('.divNoEdit').data('isreqd') == 1) {
      if (finalVal === '') {
        mother.find('.divVal').append('<p>Text cannot be missing.</p>');
        return null;
      } else {
        mother.find('.divVal').empty();
      }
    }

    var decimal = mother.find('.divNoEdit').data('decimal');

    if (decimal !== '') {
      finalVal = Number(finalVal).toFixed(decimal);
    }

    mother.find('.divNoEdit p').text(finalVal);
    mother.find('.divNoEdit').css('border-color', 'red');
    mother.find('.divEdit').hide(150);
    mother.find('.divNoEdit').show(150);
    mother.trigger('change');

  }); // end of click on update button

  $(document).on('click', '.widgetNumericDB .btnCancel', function(){

    var mother = $(this).parents('.widgetNumericDB');
    mother.find('.tbEdit').text('');
    mother.find('.divEdit').hide(150);
    mother.find('.divNoEdit').show(150);

    if (mother.find('.divVal').html() !== '') {
      mother.find('.divVal').empty();
    }

  }); // end of click on cancel button

  // data from server to client on updating server side value of widget or on updating changes to database (receives server side updateWidget function output)

  Shiny.addCustomMessageHandler('sendToWidgetNumericDB', function(data) {

    if (data.isUpdatedInDB[0] === true) {
      $('#' + data.id[0]).find('.divNoEdit').css('border-color', 'gray');
    }

    if (data.value[0] !== '') {
      $('#' + data.id[0]).find('.divNoEdit p').text(data.value[0]);
    }

    if (data.msg[0] !== '') {
      $('#' + data.id[0]).find('.divVal').append('<p>' + data.msg[0] + '</p>');
    }

  });

  Shiny.addCustomMessageHandler('validateWidgetNumericDB', function(data) {

    var mother = $('#' + data.id[0]).parents('.widgetNumericDB');
    mother.find('.tbEdit').val('');
    $('#' + data.id[0]).find('.divVal').append('<p>' + data.message[0] + '</p>');

  });

  var widgetNumericDBBinding = new Shiny.InputBinding();

  $.extend(widgetNumericDBBinding, {

    find: function(scope) {
      return $(scope).find('.widgetNumericDB');
    },

    initialize: function(el) {
      initiateWidgetNumericDB(el);
    },

    getValue: function(el) {
      return  $(el).find('.divNoEdit p').text();
    },

    getType: function() {
      return 'shinyDBWidget.widgetNumericDBBinding';
    },

    subscribe: function(el, callback) {
      $(el).on('change.widgetNumericDBBinding', function(e) {
        callback();
      });
    },

    unsubscribe: function(el) {
      $(el).off('.widgetNumericDBBinding');
    }
  });

  Shiny.inputBindings.register(widgetNumericDBBinding, 'shinyDBWidget.widgetNumericDBBinding');

}); //end of ready
