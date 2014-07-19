require.config({
  baseUrl: "app",
  paths: {
    ace: "/bower_components/ace/lib/ace",
    jquery: "/bower_components/jquery/dist/jquery.min",
    jquery_layout: "/bower_components/jquery.layout/dist/jquery.layout-latest.min",
    jquery_ui: "/bower_components/jquery-ui/jquery-ui.min",
  },
  shim: {
    jquery_layout: ['jquery', 'jquery_ui'],
    jquery_ui: ['jquery']
  }
});

require(["ace/ace", "state", 'jquery', 'jquery_layout'],function(ace, state, $){
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/plain_text");
  document.state = state;

  $('body').layout({applyDefaultStyles:true});

  var release_lock = 0;
  $('#input').on('keyup', function(event) {
    if(!state.held('input')) {
      state.grab('input').then(function(){
        state.set('input', $(this).val());
        if(release_lock)
          clearTimeout(release_lock);

        release_lock = setTimeout(function(){
          console.log("release");
          state.release('input');
        }, 1000);

      });
    } else {
//      state.set('input', $(this).val());
      event.preventDefault();
    }
  });

  state.on('outputs', function(record) {
    $("#output").text(record.val.stdout);
  });

  state.on('input', function(record) {
    console.log("input update", record);
    //$("#input").val(record.val);
  });
});
