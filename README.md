# publicgoods-scripts
Bash and Javascript scripts to generate the static site for the [Digital Public Goods](https://digitalpublicgoods.net) from a WordPress site. The scripts on this repo are not meant to be used directly, but rather used in the creation of automatic builds through a Continuous Integration (CI) framework, such as a [GitHub Pages](https://pages.github.com/).

This is one of four interconnected repositories; refer to the [publicgoods-website](https://github.com/unicef/publicgoods-website) for an overview. 

## 🛠 Development

To test the functionality of these scripts, you can run the following commands in sequence:

1. `npm i`: Installs all the required project dependencies
2. Clone the other interconnected repositories:
    ```bash 
    git clone https://github.com/unicef/publicgoods-website.git ../publicgoods-website
    git clone https://github.com/unicef/publicgoods-candidates.git ../publicgoods-candidates
    ```
3. `./static.bash`: crawls a private instance of the WordPress website and saves a copy in `../publicgoods-website`
4. `node generate_dpgs.js`: generates the individual website pages for each vetted digital public good
5. `node generate_nominees.js`: queries the GitHub API for activity data for each linked repo
6. `node index.js`: generates the registry page
7. `npm run build`: builds the React components associated with the registry
8. `./moveFiles.bash`: moves the React components generated above and the registry page into the website folder

To test the result:
1. Change folders into the website repo: `cd ../publicgoods-website`
2. Run a webserver: `./.develop.bash`
3. Point your browser to http://localhost:8080 to see the result
