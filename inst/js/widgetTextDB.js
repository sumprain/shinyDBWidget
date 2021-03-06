$(document).ready(function() {

  function initiateWidgetTextDB(widget) {
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

  }

  // var inputTxt = prompt('Enter text: ', '');
  //$('.divNoEdit p').text(inputTxt);

  //var initVal = $(document).find('.divNoEdit p').text();
  //var finalVal = '';

  $(document).on('dblclick', '.widgetTextDB .divNoEdit', function(evt) {
    var mother = $(this).parents('.widgetTextDB');
      if (mother.find('.divNoEdit').data('readonly') == 0) {
        mother.find('.divNoEdit').hide(150);
        mother.find('.divEdit').show(150);
      }
      mother.find('.tbEdit').val(mother.find('.divNoEdit p').text());
      if (mother.find('.divNoEdit').data('readonly') == 1) {
        mother.find('.btnUpdate').trigger('click');
      }    //initVal = mother.find('.divNoEdit p').text();

  }); // end of double click

  $(document).on('click', '.widgetTextDB .btnUpdate', function(evt) {

    var mother = $(this).parents('.widgetTextDB');
    //var el = $(evt.target).parents('.widget');
    var finalVal = mother.find('.tbEdit').val();

    mother.find('.divVal').empty();

    if (mother.find('.divNoEdit').data('isreqd') == 1) {
      if (finalVal === '') {
        mother.find('.divVal').append('<p>Text cannot be missing.</p>');
        return null;
      } else {
        mother.find('.divVal').empty();
      }
    }

    mother.find('.divNoEdit p').text(finalVal);
    mother.find('.divNoEdit').css('border-color', 'red');
    mother.find('.divEdit').hide(150);
    mother.find('.divNoEdit').show(150);
    mother.trigger('change');

  }); // end of click on update button

  $(document).on('click', '.widgetTextDB .btnCancel', function(){

    var mother = $(this).parents('.widgetTextDB');
    mother.find('.tbEdit').text('');
    mother.find('.divEdit').hide(150);
    mother.find('.divNoEdit').show(150);

    if (mother.find('.divVal').html() !== '') {
      mother.find('.divVal').empty();
    }

  }); // end of click on cancel button

  // data from server to client on updating server side value of widget or on updating changes to database (receives server side updateWidget function output)

  Shiny.addCustomMessageHandler('sendToWidgetTextDB', function(data) {

    if (data.isUpdatedInDB[0] === true) {
      $('#' + data.id[0]).find('.divNoEdit').css('border-color', 'gray');
    }

    if (data.value[0] !== '') {
      $('#' + data.id[0]).find('.divNoEdit p').text(data.value[0]);
    }

  });

  Shiny.addCustomMessageHandler('validateWidgetTextDB', function(data) {

    var mother = $('#' + data.id[0]).parents('.widgetTextDB');
    mother.find('.tbEdit').val('');
    $('#' + data.id[0]).find('.divVal').append('<p>' + data.message[0] + '</p>');

  });

  var widgetTextDBBinding = new Shiny.InputBinding();

  $.extend(widgetTextDBBinding, {

    find: function(scope) {
      return $(scope).find('.widgetTextDB');
    },

    initialize: function(el) {
      initiateWidgetTextDB(el);
    },

    getValue: function(el) {
      return  $(el).find('.divNoEdit p').text();
    },

    getType: function(el) {
      return 'shinyDBWidget.widgetTextDBBinding';
    },

    subscribe: function(el, callback) {
      $(el).on('change.widgetTextDBBinding', function(e) {
        callback();
      });
    },

    unsubscribe: function(el) {
      $(el).off('.widgetTextDBBinding');
    }
  });

  Shiny.inputBindings.register(widgetTextDBBinding, 'shinyDBWidget.widgetTextDBBinding');

});  //end of ready



