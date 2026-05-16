function handler(event) {
  var request = event.request;
  var uri = request.uri || "/";

  // Keep framework/static assets untouched.
  if (uri.startsWith('/_next/') || uri.startsWith('/api/') || uri.startsWith('/media/')) {
    return request;
  }

  // Keep common root files untouched.
  if (uri === '/favicon.ico' || uri === '/robots.txt' || uri === '/sitemap.xml') {
    return request;
  }

  // Keep direct asset/file requests untouched.
  if (uri.lastIndexOf('.') > uri.lastIndexOf('/')) {
    return request;
  }

  // Map pretty jobs URL to exported static page.
  // Browser URL remains /jobs/<id>, but origin serves /job/index.html.
  if (uri.startsWith('/jobs/')) {
    request.uri = '/job/index.html';
    return request;
  }

  // SPA fallback for other app routes.
  request.uri = '/index.html';
  return request;
}
