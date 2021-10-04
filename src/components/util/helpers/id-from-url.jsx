/**
 * @param {object} string - the url to cut id from.
 * @returns {string} the id
 */
function idFromUrl(string) {
  return string.match(/[A-Za-z0-9]{26}/).shift();
}

export default idFromUrl;
