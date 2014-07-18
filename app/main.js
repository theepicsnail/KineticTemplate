require.config({
  baseUrl: "app",
  paths: {
  }
});

require(["state"],function(state) {
  state.set("input", "hello world");
  document.state = state;
});
