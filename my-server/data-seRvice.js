const siteData = require("../data/NHSiteData");
const provinceAndTerritoryData = require("../data/provinceAndTerritoryData");

let sites = [];

async function initialize() {
    try {
        sites = siteData.map(site => {
            const provinceOrTerritoryObj = provinceAndTerritoryData.find(p => p.code === site.provinceOrTerritoryCode);
            return {
                ...site,
                provinceOrTerritoryObj: provinceOrTerritoryObj || {}
            };
        });
    } catch (error) {
        throw new Error("Error on site data: " + error.message);
    }
}

async function getAllSites() {
    if (sites.length > 0) {
        return sites;
    } else {
        throw new Error("No sites available");
    }
}

async function getSiteById(id) {
    const site = sites.find(site => site.siteId === id);
    if (site) {
        return site;
    } else {
        throw new Error(`Unable to find site with ID: ${id}`);
    }
}

async function getSitesByProvinceOrTerritoryName(name) {
    const foundSites = sites.filter(site => 
        site.provinceOrTerritoryObj.name?.toLowerCase().includes(name.toLowerCase())
    );
    if (foundSites.length > 0) {
        return foundSites;
    } else {
        throw new Error(`Unable to find sites in province/territory: ${name}`);
    }
}

async function getSitesByRegion(region) {
    const foundSites = sites.filter(site => 
        site.provinceOrTerritoryObj.region?.toLowerCase().includes(region.toLowerCase())
    );
    if (foundSites.length > 0) {
        return foundSites;
    } else {
        throw new Error(`Unable to find sites in region: ${region}`);
    }
}

async function getSitesBySubRegionName(subRegionName) {
    const foundSites = sites.filter(site => 
        site.provinceOrTerritoryObj.subRegion?.toLowerCase().includes(subRegionName.toLowerCase())
    );
    if (foundSites.length > 0) {
        return foundSites;
    } else {
        throw new Error(`Unable to find sites in sub-region: ${subRegionName}`);
    }
}

module.exports = { initialize, getAllSites, getSiteById, getSitesByProvinceOrTerritoryName, getSitesByRegion, getSitesBySubRegionName };
