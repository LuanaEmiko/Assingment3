/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Luana Emiko Silva Nakazo Student ID: 124231234 Date: 02/18/2025
*
*  Published (web app) URL: 
*
********************************************************************************/

const express = require('express');
const app = express();
const path = require('path');
const HTTP_PORT = process.env.PORT || 8080;

const { initialize, getAllSites, getSiteById, getSitesByProvinceOrTerritoryName, getSitesByRegion, getSitesBySubRegionName } = require('./data-service');

app.use(express.static(__dirname + '/public'));

initialize().then(() => {
    console.log("Site data initialized successfully");
}).catch((error) => {
    console.error("Error initializing site data: " + error.message);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
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
        res.json(sites);

    } catch (error) {
        console.error("Error fetching sites: " + error.message);
        res.status(404).send({ message: error.message });
    }
});

app.get('/sites/:siteId', async (req, res) => {
    try {
        const site = await getSiteById(req.params.siteId);
        res.json(site);
    } catch (error) {
        console.error("Error fetching site by ID: " + error.message);
        res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
    }
});

app.get(`/img/${file}`, (req,res) => {
    res.sendFile(path.join(__dirname,`./img/${__filename}`))
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});

app.listen(HTTP_PORT, () => console.log(`Server listening on: ${HTTP_PORT}`));
