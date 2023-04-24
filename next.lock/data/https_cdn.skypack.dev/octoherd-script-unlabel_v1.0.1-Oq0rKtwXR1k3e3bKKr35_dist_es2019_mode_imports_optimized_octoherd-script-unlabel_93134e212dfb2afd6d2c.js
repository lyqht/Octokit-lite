const getLabels = async (octokit, repository) => {
  const fetchedLabels = [];
  let currentPage = 1;
  let continueFetching = true;
  while (continueFetching) {
    const currentPageFetched = await octokit.request("GET /repos/{owner}/{repo}/labels", {
      owner: repository.owner.login,
      repo: repository.name,
      per_page: 100,
      page: currentPage
    });
    const currentFetchedData = currentPageFetched.data;
    fetchedLabels.push(...currentFetchedData);
    if (currentFetchedData.length === 100) {
      currentPage += 1;
    } else {
      continueFetching = false;
    }
  }
  return fetchedLabels;
};
async function script(octokit, repository, options) {
  const labels = options.labels.split(",");
  const repoLabels = await getLabels(octokit, repository);
  const existingLabels = repoLabels.map((l) => l.name);
  const labelsToBeDeleted = labels.filter((name) => existingLabels.find((label) => label === name));
  if (labelsToBeDeleted.length > 0) {
    await Promise.all(labelsToBeDeleted.map((name) => {
      octokit.request("DELETE /repos/{owner}/{repo}/labels/{name}", {
        repo: repository.name,
        owner: repository.owner.login,
        name
      });
    }));
    octokit.log.info(`Labels ${labels} removed from ${repository.name}`);
  }
}
export {script};
export default null;
