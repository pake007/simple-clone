# simple-clone

Simple-clone is a very simple jQuery plugin which can clone jQuery element or remove the cloned elements, especially useful in a form.

##Usage

Copy simpleclone.js and simpleclone.css to your application folder, include them in your page, done. Don't forget to include jquery first!

Then you can call simple clone function to make the html elements be able to cloned and removed.

To use that, make sure you have a div wrapped the elments, like:

    <div class='email_group'>
      <input id='email' name='user[emails][]' size='30' type='email'></input>
    </div>

Then call the ONLY and SIMPLE api of simple-clone:

    <script type='text/javascript'>
      $(document).ready(function() {
        $('.email_group').simple_clone();
      });
    </script>

That's it!

Oh, you can also have options in simple_clone function, now the available options are "label" and "label_colon", which can attach the field label before the elements, when you do clone, the label will be automatically changed by order.

    <script type='text/javascript'>
      $(document).ready(function() {
        $('.email_group').simple_clone({
          label: 'E-mail',    // add label 'E-mail xxx' before the element, xxx is the number.
          label_colon: true   // label ends with a colon
        });
      });
    </script>

## Contribution

Thanks maoqiuyun @Ekohe, who helped me to work on this plugin.