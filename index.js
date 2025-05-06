/**
 * @author: Abrar Hayat <abrarhayat@gmail.com>
 * @since: Tue, 06 May 2025
 */

const core = require('@actions/core');
const github = require('@actions/github');

const includeCurrentRepo = core.getInput('include-current-repo') === 'true';

github.getOctokit(process.env.GITHUB_TOKEN).rest.packages.listPackagesForOrganization({
  org: core.getInput('organization') || process.env.GITHUB_REPOSITORY_OWNER,
  package_type: "maven",
  per_page: 500,
  page: 1
}).then(responseJson => {
  const packagesInAccess = responseJson.data;
  // Needs to have access to the package of the current repo and other packages
  // in the organization.
  const currentRepoName = github.context.repo.repo.toLowerCase();
  if (!includeCurrentRepo) {
    packagesInAccess.forEach((packageInAccess) => {
      const packageRepository = packageInAccess.repository.name.toLowerCase();
      const packageRepositoryOwner = packageInAccess.repository.owner.login.toLowerCase();
      const packageRepositoryFullName = `${packageRepositoryOwner}/${packageRepository}`;
      if (!includeCurrentRepo && packageRepositoryFullName === currentRepoName) {
        packagesInAccess.splice(packagesInAccess.indexOf(packageInAccess), 1);
      }
    });
  }
  if (packagesInAccess.length > 0) {
    core.setOutput("has-access-to-packages", true);
    packagesInAccess.forEach((packageInAccess) => {
      const packageName = packageInAccess.name;
      console.log(`Package ${packageName} is in the list of packages in access.`);
    });
  } else {
    core.setOutput("has-access-to-packages", false);
    console.log("No packages found in the organization. Please check the if the access token is still valid.");
    core.setFailed("No packages found in the organization. Please check the if the access token has the necessary permissions.");
  }
})
  .catch((error) => {
    console.error("Error fetching packages, please check access token.", error);
    core.setFailed("Error fetching packages, please check if access token is valid.");
  }
  );