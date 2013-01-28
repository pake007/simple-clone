# simple-clone

Simple-clone is a very simple jQuery plugin which can clone jQuery element or remove the cloned elements, especially useful in a form.

When you apply simple-clone on a jQurey element, simple-clone will create a '+' button behind it, you can click the '+' to duplicate a similar element on the new line, you can clone as many as you want. After the cloned elements, you can see a '-' button, clicking it will remove the cloned elements.

##Usage

Copy simpleclone.js and simpleclone.css to your application folder, include them in your page, done. Don't forget to include jquery first!

Then you can call simple clone function to make the html elements be able to cloned and removed.

### Basic
To use that, make sure you have a div wrapping the elments, like:

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

### Options

Oh, you can also have options in simple_clone function.

Option :label can attach the field label before the elements, when you do clone, the label will be automatically changed by order.
Option :label_colon controls the exisitence of the colon at the end of the label.

      $('.email_group').simple_clone({
        label: 'E-mail',    // add label 'E-mail xxx' before the element, xxx is the number.
        label_colon: true   // label ends with a colon
      });

Option :nested can allow you to build nested form, default is false. Example:

      <div class='project_group'>
        <input id='user_projects_name' name='user[projects][name]'></input>
        <input id='user_projects_description' name='user[projects][description]'></input>
      </div>
      
      $('.project_group').simple_clone({
        nested: true
      });

This will generate the input name like 'user[projects][0][name]', 'user[projects][1][name]' after you doing clone operation, which is useful for nested form with the has_many relationship.
      
### Customize
Simple-clone provides a very simple css, you can easily customize youself, like setting the img for the '+' and '-' button.

## Contribution

Thanks maoqiuyun @Ekohe, who helped me to work on this plugin.