$(document).ready(function() {

  // utility functions ===============================================================
  function populateSelect(select, data) {
    // populate option of select if given initially, else it will be filled by update
    // @select is a select tag
    // @data is a JSON object representing data frame

    var htm = '';

    $.each(data, function(ind, row) {
      htm += '<option value="' + row.val + '">' + row.text + '</option>';
    });

    select.append(htm);

  }
  // --------------------------------------------------------------------------------
  function getChoices(widget) {
    // function to calculate choices JSON object from option fields of select.
    widget = $(widget);

    var obj = [];

    opts = widget.find('.tbEdit option');


    $.each(opts, function(ind, row) {
      obj[ind] = {val: $(row).attr("value"), text: $(row).text()};
    });

    return obj;

  }
  // --------------------------------------------------------------------------------

  function valToText(data, val) {
    // needs JSON data

    var text;

    $.each(data, function(ind, row) {
      if (row.val == val) {
        text = row.text;
      }
    });

    return text;
  }
  // -------------------------------------------------------------------------------
  function textToVal(data, text) {
    // needs JSON data

    var val;

  $.each(data, function(ind, row) {
    if (row.text == text) {
      val = row.val;
    }
  });

  return val;

  }

  // =============================================================================

  function initiateWidgetSelectDB(widget) {
    widget = $(widget);

    var choices = widget.find('.divNoEdit').data('choices');
    var selectedText = widget.find('.divNoEdit').data('selectedtext');

    if (choices !== '') {
      populateSelect(widget.find('.tbEdit'), choices);
      if (selectedText !== '') {
        widget.find('.tbEdit').val(textToVal(choices, selectedText));
      }
    }

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
  }  // end of initiateWidgetSelectDB


  $(document).on('dblclick', '.widgetSelectDB .divNoEdit', function(evt) {
    var mother = $(this).parents('.widgetSelectDB');

      if (mother.find('.divNoEdit').data('readonly') == 0) {
        mother.find('.divNoEdit').hide(150);
        mother.find('.divEdit').show(150);
      }
      mother.find('.tbEdit').val(textToVal(getChoices(mother), mother.find('.divNoEdit p').text()));
      if (mother.find('.divNoEdit').data('readonly') == 1) {
        mother.find('.btnUpdate').trigger('click');
      }    //initVal = mother.find('.divNoEdit p').text();

  }); // end of double click

  $(document).on('click', '.widgetSelectDB .btnUpdate', function(evt) {

    var mother = $(this).parents('.widgetSelectDB');
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

    mother.find('.divNoEdit p').text(valToText(getChoices(mother), finalVal));
    mother.find('.divNoEdit').css('border-color', 'red');
    mother.find('.divEdit').hide(150);
    mother.find('.divNoEdit').show(150);
    mother.trigger('change.widgetSelectDBBinding');

  }); // end of click on update button

  $(document).on('click', '.widgetSelectDB .btnCancel', function(){

    var mother = $(this).parents('.widgetSelectDB');
    //mother.find('.tbEdit').text('');
    mother.find('.divEdit').hide(150);
    mother.find('.divNoEdit').show(150);

    if (mother.find('.divVal').html() !== '') {
      mother.find('.divVal').empty();
    }

  }); // end of click on cancel button

  /*$(document).on('change', '.widgetSelectDB .tbEdit', function(evt) {
    // prevents the select event to be propagated
    var mother = $(this).parents('.widgetSelectDB');
    mother.off('change.widgetSelectDBBinding');
  });*/ // end of select

  // data from server to client on updating server side value of widget or on updating changes to database (receives server side updateWidget function output)

  Shiny.addCustomMessageHandler('sendToWidgetSelectDB', function(data) {

    if (data.isUpdatedInDB[0] === true) {
      $('#' + data.id[0]).find('.divNoEdit').css('border-color', 'gray');
    }

    if (data.choices[0] !== '') {
      // new dataframe has been provided for filling options of select

      var choices = data.choices;
      var selectedText = data.selectedText[0];

      populateSelect($('#' + data.id[0]).find('.tbEdit'), choices);

      if (selectedText !== '') {
        $('#' + data.id[0]).find('.tbEdit').val(textToVal(getChoices($('#' + data.id[0]).find('.tbEdit')), selectedText));
        $('#' + data.id[0]).find('.divNoEdit p').text(selectedText);
      }

    }

  });

  Shiny.addCustomMessageHandler('validateSelectDB', function(data) {

    var mother = $('#' + data.id[0]).parents('.widgetSelectDB');
    mother.find('.tbEdit').val('');
    $('#' + data.id[0]).find('.divVal').append('<p>' + data.message[0] + '</p>');

  });

  var widgetSelectDBBinding = new Shiny.InputBinding();

  $.extend(widgetSelectDBBinding, {

    find: function(scope) {
      return $(scope).find('.widgetSelectDB');
    },

    initialize: function(el) {
      initiateWidgetSelectDB(el);
    },

    getValue: function(el) {

      return $(el).find('.tbEdit').val();
      //return  valToText(getChoices(el), $(el).find('.divNoEdit p').text());
    },

    getType: function() {
      return 'shinyDBWidget.widgetSelectDBBinding';
    },

    subscribe: function(el, callback) {
      $(el).on('change.widgetSelectDBBinding', function(e) {
        if (e.target == el){
          callback();
        }
      });
    },

    unsubscribe: function(el) {
      $(el).off('.widgetSelectDBBinding');
    }
  });

  Shiny.inputBindings.register(widgetSelectDBBinding, 'shinyDBWidget.widgetSelectDBBinding');

}); //end of ready
