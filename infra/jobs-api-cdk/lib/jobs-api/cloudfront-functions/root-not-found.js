function handler() {
  return {
    statusCode: 404,
    statusDescription: "Not Found",
    headers: {
      "content-type": { value: "application/json; charset=utf-8" },
      "cache-control": { value: "no-store" },
    },
    body: JSON.stringify({ error: "not found" }),
  };
}
