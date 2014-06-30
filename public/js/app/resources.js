define(["promise"], function(Promise) {
  return {
    load: function() {
      return new Promise(function(a){a();});
    }
    // Provide whatever access to resources you want here.
    // E.g. R.getModel('knight'), R.getIcon('close')... whatever
  };
});
