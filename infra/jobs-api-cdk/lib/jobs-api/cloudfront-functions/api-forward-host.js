function handler(event) {
  var request = event.request;
  var hostHeader = request.headers.host;
  if (hostHeader && hostHeader.value) {
    request.headers["x-public-host"] = { value: hostHeader.value };
  }

  var protoHeader = request.headers["cloudfront-forwarded-proto"];
  if (protoHeader && protoHeader.value) {
    request.headers["x-public-proto"] = { value: protoHeader.value };
  }

  return request;
}
