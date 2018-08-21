# Locationfinder bundle
A location can be searched by entering search criteria in a text field. The application helps the user to find the desired location by automatically suggesting suitable results while typing.

Sample App
------------------
https://demos.conterra.de/mapapps/resources/apps/downloads_locationfinder/index.html

Installation Guide
------------------
1. First, you need to add the bundles "dn_locationfinder" to your app.
2. After that, configure your LocationFinderStore as described below.

#### Configurable Components of dn_locationfinder:

##### LocationFinderStore:
```
"LocationFinderStore": {
    "id": "locationfinderstore",
    "title": "Suchdienst",
    "description": "Suchdienst",
    "useIn": [
        "omnisearch"
    ],
    "omniSearchDefaultLabel": "Ort, Adresse, POI...",
    "omniSearchSearchAttr": "name",
    "omniSearchDisableSortOptions": true,
    "omniSearchLabelString": "${name} (${type_resolved})",
    "omniSearchTypingDelay": 200,
    "parameters": {},
    "url": "https://***/Finder/Lookup",
    "wkid": 25832,
    "resolveType": true
}
```

Development Guide
------------------
### Define the mapapps remote base
Before you can run the project you have to define the mapapps.remote.base property in the pom.xml-file:
`<mapapps.remote.base>http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%</mapapps.remote.base>`

##### Other methods to to define the mapapps.remote.base property.
1. Goal parameters
`mvn install -Dmapapps.remote.base=http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%`

2. Build properties
Change the mapapps.remote.base in the build.properties file and run:
`mvn install -Denv=dev -Dlocal.configfile=%ABSOLUTEPATHTOPROJECTROOT%/build.properties`
