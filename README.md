[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

# publicgoods-scripts
Bash and Javascript scripts to generate the static site for the [Digital Public Goods](https://digitalpublicgoods.net) from a WordPress site. The scripts on this repo are not meant to be used directly, but rather used in the creation of automatic builds through a Continuous Integration (CI) framework, such as a [GitHub Pages](https://pages.github.com/).

This is one of four interconnected repositories; refer to the [publicgoods-website](https://github.com/DPGAlliance/publicgoods-website) for an overview. 

## Configuration

This repository is managed with NPM version 7 **workspaces** which requires Node version 15 or higher. Read the [workspaces documentation](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to know how to install and manage dependencies across packages in this repository.

## 🛠 Development

To test the functionality of these scripts, you can run the following commands in sequence:

1. `npm i`: Installs all the required project dependencies
2. Clone the other interconnected repositories:
    ```bash 
    git clone https://github.com/DPGAlliance/publicgoods-website.git ../publicgoods-website
    git clone https://github.com/DPGAlliance/publicgoods-candidates.git ../publicgoods-candidates
    ```
3. `./scripts/static.bash`: crawls a private instance of the WordPress website and saves a copy in `../publicgoods-website`
4. `pushd packages/automation && node consolidate_data.js && popd`: consolidates nomiees and DPGs from the new api into a single `nominees.json` file for the registry page.
5. ~~`pushd packages/automation && node generate_dpgs.js && popd`: generates the individual website pages for each vetted digital public good~~
6. ~~`pushd packages/automation && node generate_nominees.js && popd`: queries the GitHub API for activity data for each linked repo~~
7. `pushd packages/automation && node index.js && popd`: generates the registry page
8. `pushd packages/registry && npm run build && popd`: builds the React components associated with the registry
9. `./scripts/moveFiles.bash`: moves the React components generated above and the registry page into the website folder

To test the result:
1. Change folders into the website repo: `cd ../publicgoods-website`
2. Run a webserver: `./.develop.bash`
3. Point your browser to http://localhost:8080 to see the result

## 🚀 Deployment

When a merge is pushed onto the `main` branch in the [DPGAlliance/publicgood-scripts](https://github.com/DPGAlliance/publicgoods-scripts/) repository, no build is pushed to the [DPGA public website](https://digitalpublicgoods.net/). 
The public website is updated under these 3 circumstances:
* When a commit or pull request is merged on the `main` branch of the [DPGAlliance/publicgood-candidates](https://github.com/DPGAlliance/publicgoods-candidates/) repo
* Every night at midnight GMT
* Manually triggered through [GitHub Actions](https://github.com/DPGAlliance/publicgoods-candidates/actions) in the [DPGAlliance/publicgood-candidates](https://github.com/DPGAlliance/publicgoods-candidates/) repo

You can manually trigger a new website build by visiting the [Actions](https://github.com/DPGAlliance/publicgoods-candidates/actions) tab on the [publicgoods-candidates](https://github.com/DPGAlliance/publicgoods-candidates/actions) repo, though *you need **Write** permissions on that repo*:
1. Visit [the Actions link](https://github.com/DPGAlliance/publicgoods-candidates/actions)
2. Click on Automatic Build on the left column.
3. Click on Run Workflow on the right side, (keep the main branch selected) and click again the green Run Workflow button. 

Wait for about 10 minutes, and the new website will reflect the changes from the [DPGAlliance/publicgood-scripts](https://github.com/DPGAlliance/publicgoods-scripts/) repository.
