/*
simple_clone v0.6
Requires jQuery version: >= 1.3.0

Copyright (c) 2011-2013 Jimmy Huang

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/


(function($) {

$.fn.simple_clone = function(custom_option){
  var option = custom_option || {};

  var e = $(this);
  e.addClass("left")
  var out_wrapper = "<div class='outer_simple_wrapper'></div>"
  var wrapper = "<div class='simple_wrapper'></div>"
  var plus = "<span class='simple_plus'>+</span>"
  var minus = "<span class='simple_minus'>-</span>"
  var clear = "<div class='simple_clear'></div>";

  // ------------  case 1: if have already multiple groups
  if(e.length > 1) {
    e.wrap(wrapper);
    // we only wrapper one outer_simple_wrapper for all groups
    var existing_outer_wrapper;
    e.each(function(i){
      existing_outer_wrapper = $(this).parent().siblings(".outer_simple_wrapper");
      if(existing_outer_wrapper.length == 0) {
        $(this).parent().wrap(out_wrapper);
      } else {
        $(this).parent().appendTo(existing_outer_wrapper);
      }
      // append '- +' after the last group, otherwise append only a '-'
      if(i == e.length-1){
        $(this).after(plus).after(minus);
      } else{
        $(this).after(minus);
      }
    })
  }
  // ------------- case 2: if only has one wrapper, general case
  else{
    // wrap wrappers
    e.wrap(out_wrapper).wrap(wrapper);
    // if the list can be empty (all elements can be removed), add an "-" after the first elements
    if(option.canBeEmpty) {
      e.after(minus);
    }
    // add an original "+" after the elements
    e.after(plus);
  }

  var startIndex = option.nested ? option.start || 0 : 0;

  // append a initial number to elements id, if options[:nested] true, also assign a initial number to the element name
  e.find("input, select").each(function(){
    var old_id = $(this).attr("id");
    $(this).attr("id", old_id+'_' + startIndex);
    if(option.nested == true) {
      var old_name = $(this).attr("name");
      var reg = /\[\w*\]$/;
      var match = reg.exec(old_name);
      var new_name = old_name.substr(0, match.index) + "[" + startIndex + "]" + match[0];
      $(this).attr("name", new_name);
    }
  })
  // append a clear div
  e.parent().append(clear);

  // append a initial label if option.label exists
  if(option.label) {
    // replace the old label by new label
    $(this).find("label").remove();
    e.each(function(j){
      var label = "<label class='simple_label'>" + option.label + (j+1) + "</label>";
      $(this).before(label);
       // add ":" after label
      if(option.label_colon == true){
        var label_text = $(this).siblings("label.simple_label").text();
        $(this).siblings("label.simple_label").text(label_text + " :");
      }
    });
  }


  // -------------------------- regenerate ids of input and select inside the wrapper ---------------------
  $.fn.regenerate_ids = function(number){
    $(this).find("input, select").each(function(){
      var old_id = $(this).attr("id");
      var old_number = old_id.match(/.*?(_\d+)/)[1];
      var old_number_index = old_id.lastIndexOf(old_number);
      var new_id = old_id.substring(0,old_number_index) + "_" + number
      $(this).attr("id", new_id);
    });
  };
  
  // -------------------------- regenerate name of input and select inside the wrapper ----------------------
  $.fn.regenerate_names = function(number){
    $(this).find("input, select").each(function(){
      var old_name = $(this).attr("name");
      var old_number = old_name.match(/.*\[(\d+)\]/)[1];  // find the last match
      var old_number_index = old_name.lastIndexOf(old_number);
      var new_name = old_name.substring(0,old_number_index) + number + old_name.substring(old_number_index+1);
      $(this).attr("name", new_name);
    });
  };

  // -------------------------- regenerate label text inside the wrapper ----------------------------------
  $.fn.regenerate_label = function(number){
    $(this).find("label.simple_label").text(option.label + number);
    if(option.label_colon == true) {
      var re_label_text = $(this).find("label.simple_label").text();
      $(this).find("label.simple_label").text(re_label_text + " :");
    }
  };

  // ---------------------------- '+' button event ---------------------------------------------------------
  $("span.simple_plus").die("click").live("click", function(){
    var outer_wrapper = $(this).closest(".outer_simple_wrapper");
    var wrapper_count = outer_wrapper.find(".simple_wrapper").length;
    var last_wrapper = outer_wrapper.find(".simple_wrapper").last();

    // deal with '-' and '+' button
    var plus_button = last_wrapper.find(".simple_plus");

    // if has '-' button, just remove '+' button; else change the '+' to '-' button (first wrapper)
    if(last_wrapper.find(".simple_minus").length > 0){
      plus_button.remove();
    } else {
      plus_button.replaceWith(minus);
    }

    // clone the wrapper
    var cloned_wrapper = last_wrapper.clone();
    last_wrapper.after(cloned_wrapper);

    // append the '+' button to the new wrapper
    cloned_wrapper.find(".simple_minus").after(plus);
    // clear the new wrapper input content
    cloned_wrapper.find("input, select").val("");

    // generate new id for input and select in cloned_wrapper
    var current_wrapper_count = wrapper_count + 1;
    cloned_wrapper.regenerate_ids(current_wrapper_count-1+startIndex);
    
    // generate new name for input and select in cloned_wrapper if option[:nested] true
    if(option.nested == true){
      cloned_wrapper.regenerate_names(current_wrapper_count-1+startIndex);
    }
    
    // generate new label for cloned_wrapper
    cloned_wrapper.regenerate_label(current_wrapper_count);

    // clear some extra elements (eg: error messages)
    cloned_wrapper.find(".simple_plus").nextAll().each(function(){
      if(!$(this).hasClass("simple_clear")){
        $(this).remove();
      };
    })
  });

  // ---------------------------- '-' button event ----------------------------------------------------------
  $("span.simple_minus").die("click").live("click", function(){
    var outer_wrapper = $(this).closest(".outer_simple_wrapper");
    var wrapper_count = outer_wrapper.find(".simple_wrapper").length;
    // if you clicked the '-' of the last wrapper, later you will need to clone a new '+' button
    var need_clone_plus_button = false;
    if($(this).next(".simple_plus").length > 0){
      need_clone_plus_button = true;
    }
    // remove the parent wrapper
    $(this).parent().remove();

    // make sure the new last wrapper has correct '-' and '+' button
    var remaining_wrapper_count = wrapper_count - 1;
    var last_wrapper = outer_wrapper.find(".simple_wrapper").last();
    if(remaining_wrapper_count > 1) {
      if(need_clone_plus_button == true) {
        last_wrapper.find(".simple_minus").after(plus);
      }
    } else {
      // if only one wrapper remaining
      if(option.canBeEmpty) {
        last_wrapper.find(".simple_minus").after(plus);
      } else {
        last_wrapper.find(".simple_plus").remove();
        last_wrapper.find(".simple_minus").replaceWith(plus);
      }
    }

    // regenerate ids for all remaining wrapper
    outer_wrapper.find(".simple_wrapper").each(function(i){
      $(this).regenerate_ids(i+startIndex);
    });
    
    // regenerate name for all remaining wrapper
    if(option.nested == true){
      outer_wrapper.find(".simple_wrapper").each(function(i){
        $(this).regenerate_names(i+startIndex);
      });
    }
    
    // regenerate labels for all remaining wrapper
    outer_wrapper.find(".simple_wrapper").each(function(i){
      $(this).regenerate_label(i+1);
    });
  });


};

})(jQuery);