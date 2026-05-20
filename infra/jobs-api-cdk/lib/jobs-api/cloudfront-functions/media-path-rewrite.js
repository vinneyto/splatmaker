function handler(event) {
  var request = event.request;
  if (request.uri === "/media") {
    request.uri = "/";
    return request;
  }

  if (request.uri.startsWith("/media/")) {
    request.uri = request.uri.slice("/media".length);
  }

  return request;
}
