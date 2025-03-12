/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Luana Emiko Silva Nakazo Student ID: 124231234 Date: 03/11/2025
*
*  Published URL: 
*
********************************************************************************/

const express = require('express');
const app = express();
const path = require('path');
const HTTP_PORT = process.env.PORT || 8080;

const { initialize, getAllSites, getSiteById, getSitesByProvinceOrTerritoryName, getSitesByRegion, getSitesBySubRegionName } = require('./data-service');

require('pg'); // explicitly require the "pg" module
const Sequelize = require('sequelize');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');

initialize().then(() => {
    console.log("Site data initialized successfully");
}).catch((error) => {
    console.error("Error initializing site data: " + error.message);
});

app.get('/', (req, res) => {
    res.render('home', { page: '/home' });
});

app.get('/about', (req, res) => {
    res.render('about', { page: '/about' });
});

app.get('/sites', async (req, res) => {
    try {
        const { region, provinceOrTerritory, subRegion } = req.query;

        if (region) {
            const sites = await getSitesByRegion(region);
            return res.json(sites);
        }

        if (provinceOrTerritory) {
            const sites = await getSitesByProvinceOrTerritoryName(provinceOrTerritory);
            return res.json(sites);
        }

        if (subRegion) {
            const sites = await getSitesBySubRegionName(subRegion);
            return res.json(sites);
        }

        const sites = await getAllSites();
        res.render("sites", { sites });

    } catch (error) {
        console.error("Error fetching sites: " + error.message);
        res.status(404).render("404");
    }
});

app.get('/sites/:siteId', async (req, res) => {
    try {
        const site = await getSiteById(req.params.siteId);
        res.json(site);
    } catch (error) {
        console.error("Error fetching site by ID: " + error.message);
        res.status(404).render("404");
    }
});

app.use((req, res) => {
    res.status(404).render("404");
});

app.listen(HTTP_PORT, () => console.log(`Server listening on: ${HTTP_PORT}`));

app.get("/sites", async (req, res) => {
    try {
        let sites = await getSites(req.query);
        if (sites.length === 0) {
            return res.status(404).render("404", { message: "No sites found for the specified region." });
        }
        res.render("sites", { sites });
    } catch (error) {
        res.status(404).render("404", { message: "An error occurred while retrieving sites." });
    }
});

app.get("/sites/:id", async (req, res) => {
    try {
        let site = await getSiteById(req.params.id);
        if (!site) {
            return res.status(404).render("404", { message: "No site found with the specified ID." });
        }
        res.render("site", { site });
    } catch (error) {
        res.status(404).render("404", { message: "An error occurred while retrieving the site." });
    }
});

app.use((req, res) => {
    res.status(404).render("404", { message: "The page you are looking for does not exist." });
});


