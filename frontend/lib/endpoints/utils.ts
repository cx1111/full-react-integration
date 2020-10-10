// Extract an error message from the error object from a failed request
// https://github.com/axios/axios#handling-errors
export const parseError = (e?: any): string => {
  if (!e) {
    return "Something went wrong!";
  }
  // The request was made and the server responded with a status code
  // that falls out of the range of 2xx
  if (e.response && e.response.data) {
    return e.response.data.detail || e.response.data;
  }
  // The request was made but no response was received
  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  // http.ClientRequest in node.js
  if (e.request) {
    return e.request;
  }
  // Something happened in setting up the request that triggered an Error
  if (e.message) {
    return e.message;
  }
  return "Something went wrong!";
};
