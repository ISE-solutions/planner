export default (attribute) => {
  // replace the single quotes
  attribute = attribute.replace(/'/g, "''");

  attribute = attribute.replace(/%/g, '%25');
  attribute = attribute.replace(/\+/g, '%2B');
  attribute = attribute.replace(/\//g, '%2F');
  attribute = attribute.replace(/\?/g, '%3F');

  attribute = attribute.replace(/#/g, '%23');
  attribute = attribute.replace(/&/g, '%26');
  return attribute;
};
