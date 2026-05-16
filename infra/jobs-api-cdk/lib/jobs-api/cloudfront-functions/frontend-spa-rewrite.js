function handler(event) {
  var request = event.request;
  var uri = request.uri || "/";

  // Only handle pretty job details URLs: /jobs/<id>
  // Keep every other request mapped 1:1 to static files in S3.
  if (uri.startsWith('/jobs/')) {
    // Ignore nested/static-like paths and keep them untouched.
    if (uri.lastIndexOf('.') > uri.lastIndexOf('/')) {
      return request;
    }

    var tail = uri.slice('/jobs/'.length);
    if (tail.length > 0 && tail.indexOf('/') === -1) {
      request.uri = '/job.html';
    }
  }

  return request;
}
