$(document).ready(function() {

  function initiateWidgetTimeDB(widget) {

    widget = $(widget);

    widget.find('.tbEdit').timeEntry({show24Hours: true});

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

  $(document).on('dblclick', '.widgetTimeDB .divNoEdit', function(evt) {
    var mother = $(this).parents('.widgetTimeDB');
      if (mother.find('.divNoEdit').data('readonly') == 0) {
        mother.find('.divNoEdit').hide(150);
        mother.find('.divEdit').show(150);
      }
      mother.find('.tbEdit').val(mother.find('.divNoEdit p').text());
      if (mother.find('.divNoEdit').data('readonly') == 1) {
        mother.find('.btnUpdate').trigger('click');
      }    //initVal = mother.find('.divNoEdit p').text();

  }); // end of double click

  $(document).on('click', '.widgetTimeDB .btnUpdate', function(evt) {

    var mother = $(this).parents('.widgetTimeDB');
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

  $(document).on('click', '.widgetTimeDB .btnCancel', function(){

    var mother = $(this).parents('.widgetTimeDB');
    mother.find('.tbEdit').text('');
    mother.find('.divEdit').hide(150);
    mother.find('.divNoEdit').show(150);

    if (mother.find('.divVal').html() !== '') {
      mother.find('.divVal').empty();
    }

  }); // end of click on cancel button

  // data from server to client on updating server side value of widget or on updating changes to database (receives server side updateWidget function output)

  Shiny.addCustomMessageHandler('sendToWidgetTimeDB', function(data) {

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

  Shiny.addCustomMessageHandler('validateWidgetTimeDB', function(data) {

    var mother = $('#' + data.id[0]).parents('.widgetTimeDB');
    mother.find('.tbEdit').val('');
    $('#' + data.id[0]).find('.divVal').append('<p>' + data.message[0] + '</p>');

  });

  var widgetTimeDBBinding = new Shiny.InputBinding();

  $.extend(widgetTimeDBBinding, {

    find: function(scope) {
      return $(scope).find('.widgetTimeDB');
    },

    initialize: function(el) {
      initiateWidgetTimeDB(el);
    },

    getValue: function(el) {
      if ($(el).find('.divNoEdit p').text() !== '') {
        return  $(el).find('.divNoEdit p').text();
      } else {
        return null;
      }
    },

    getType: function() {
      return 'shinyDBWidget.widgetTimeDBBinding';
    },

    subscribe: function(el, callback) {
      $(el).on('change.widgetTimeDBBinding', function(e) {
        callback();
      });
    },

    unsubscribe: function(el) {
      $(el).off('.widgetTimeDBBinding');
    }
  });

  Shiny.inputBindings.register(widgetTimeDBBinding, 'shinyDBWidget.widgetTimeDBBinding');

}); //end of ready
