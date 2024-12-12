export default (link) => {
  if (!/^http(s)?:\/\//i.test(link)) {
    return 'https://' + link;
  }

  return link;
};
