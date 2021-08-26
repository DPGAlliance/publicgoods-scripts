<h1 align="center">Map Visualization of Digital Public Goods </br>Developments and Implementations</h1>

This is a map visualization of digital public goods with multiple dimentions.

## 🤔 Rationale

The design requirements were as follows:

1. Data should be easily editable
2. Data should be displayed on a world map
3. Data would be multidimensional, and the visualization should layer multiple dimensions
4. Visualization should be easily customizable to meet the communications needs of the team

The above requirements were addressed with the following strategies:

1. Data for Pathfinders and storyline is maintained in a Google Spreadsheets that any member of the team can easily edit. The spreadsheet is published on the web, and changes in data automatically and instantaneoulsy propagate to the web application.

2. Map pulls set of JSONs from [publicgoods-candidates]('https://github.com/unicef/publicgoods-candidates')

3. Data is displayed on a world map using Mapbox, and integrated on the React frontend through the [react-mapbox-gl](https://www.npmjs.com/package/react-mapbox-gl) bindings for [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/).

4. Each workstream is visualized in its own layer, whose visibility can be toggled individually. Overlapping layers use a combination of background colors with transparency and fill patterns (hardware and lines).

5. Theming can easily be modified through CSS.

6. Storytelling feature realized with [react-scrollama](https://github.com/jsonkao/react-scrollama) library.

## 🛠 Architecture

This webapp is built using [Next.js](https://nextjs.org/) as a React Framework.
There are 2 pages: `index.js` and `helper.js`

* `pages/_app.js` is the application entry point, which loads the required stylesheets and loads `index.js`
* `pages/index.js` wraps most of the logic of the application:
    - loads the data from [google spreadsheet](https://docs.google.com/spreadsheets/d/1t75gYVhdUjPD1532DbPYN49FLXFhpRwEBFiS4Hbk6_Q) and [unicef/publicgoods-candidates](https://github.com/unicef/publicgoods-candidates) using [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration). It allows us to prerender data as JSONs, create or update static pages after the site is built. It significantly improves loading time and requires no fetches from client side. All data passed to react components as `props`.
    - loads the MapComponent from `components/mapComponents.js`
* `pages/helper.js` tool which allows team easily find logitude, latitude and zoom variables for cards in [google spreadsheet](https://docs.google.com/spreadsheets/d/1t75gYVhdUjPD1532DbPYN49FLXFhpRwEBFiS4Hbk6_Q)
* `components/mapComponent.js` loads the Mapbox map, adds a layer for each dataset, creates a popup for each country, searchBar menu to toggle the visibility of each layer of digitalpublic good, and creates filters for other layers of data.
* `components/infoComponent.js` display information about selected digital public good.
* `components/searchBox.js` interface that allows users to select and search for digital public good.

## ✏️ Configuration

In order to run this application, you need to:
- open an account with [Mapbox](https://www.mapbox.com/) to obtain an *Access Token*. 
- Copy [google spreadsheet](https://docs.google.com/spreadsheets/d/1t75gYVhdUjPD1532DbPYN49FLXFhpRwEBFiS4Hbk6_Q) for this project and [set up](https://github.com/bpk68/g-sheets-api#set-up-a-google-sheet) it so you can obtain sheets id.
The following [environment variables](https://nextjs.org/docs/basic-features/environment-variables) need to be set in `.env` or `.env.local`:
```
NEXT_PUBLIC_MAPBOX_TOKEN="MAPBOX_ACCESS_TOKEN"
NEXT_PUBLIC_SHEET_ID="SHEET_ID"
```

## 💻 Development Environment

Setup your development environment as follows:

1. Clone this repo:
    - SSL:
    ```bash
    git clone git@github.com:unicef/publicgoods-scripts
    ```
    - HTTPS:
    ```bash
    git clone https://github.com/unicef/publicgoods-scripts
    ```
2. Install root dependencies from publicgoods-script
    ```bash 
    npm install
    ```
3. Navigate to the map package
    ```bash
    cd /packages/map
    ```
4. Install project dependencies:
    ```bash
    npm install
    ```
5. After having set up the proper [Configuration](#%EF%B8%8F-configuration), run the developmnet server with [fast refresh](https://nextjs.org/docs/basic-features/fast-refresh):
    ```bash
    npm run dev
    ```
6. Access visualization via https://localhost:3000

## :memo: License

This software is licensed under the [GNU General Public License](LICENSE) as published by the Free Software Foundation, either version 3 of the License, or
any later version.

```
    Visualization of UNICEF Office of Innovation (OoI) Activities by Country
    Copyright (C) 2020 UNICEF

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
```


