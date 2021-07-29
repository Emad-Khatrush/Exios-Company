
      var $form = $( "#form" );
      var $input = $form.find( "input" );
  
      $input.on( "keyup", function( event ) {
        
        // When user select text in the document, also abort.
        var selection = window.getSelection().toString();
        if ( selection !== '' ) {
          return;
        }
        
        // When the arrow keys are pressed, abort.
        if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
          return;
        }
        
        var $this = $(this);
        var input = $this.val();
            input = input.replace(/[\W\s\._\-]+/g, '');
          
          var split = 4;
          var chunk = [];
  
          for (var i = 0, len = input.length; i < len; i += split) {
            split = ( i >= 4 && i <= 16 ) ? 6 : 4;
            chunk.push( input.substr( i, split ) );
          }
  
          $this.val(function() {
            return chunk.join("-").toUpperCase();
          });
      
      } );
    