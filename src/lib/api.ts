export const mockRunApi = async (endpoint: string, method: string, body: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let parsedBody = null;
      try {
        if (body) parsedBody = JSON.parse(body);
      } catch (e) {
        parsedBody = "Invalid JSON in request";
      }

      resolve({
        status: 200,
        message: "Success - Mock Response",
        data: {
          url: endpoint,
          method: method,
          receivedBody: parsedBody,
          timestamp: new Date().toISOString()
        }
      });
    }, 800); // 800ms mock delay
  });
};
