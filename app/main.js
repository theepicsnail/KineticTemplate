require.config({
  baseUrl: "app",
  paths: {
    jquery: "/bower_components/jquery/dist/jquery.min",
    jquery_layout: "/bower_components/jquery.layout/dist/jquery.layout-latest.min",
    jquery_ui: "/bower_components/jquery-ui/jquery-ui.min",
  },
  shim: {
    jquery_layout: ['jquery', 'jquery_ui'],
    jquery_ui: ['jquery']
  }
});

require(["state", 'jquery', 'jquery_layout'],function(state, $){
  state.set("input", "hello world");
  document.state = state;

  $('body').layout({applyDefaultStyles:true});
  $('#input').on('keyup', function() {
    state.set('input', $(this).val());
  });
  state.on('outputs', function(record) {
    $("#output").text(record.val.stdout);
  });
  state.on('input', function(record) {
    $("#input").val(record.val);
  });
});
