///
/// Copyright (C) 2025 con terra GmbH (info@conterra.de)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

const i18n = {
    root: {
        bundleName: "Esri CH Location Finder",
        bundleDescription: "A location can be searched by entering search criteria in a text field. The application helps the user to find the desired location by automatically suggesting suitable results while typing.",
        typeResolver: {
            "Gemeinde": "Community",
            "TopoName": "Topographical name",
            "Ort": "Place",
            "Stra\u00DFe": "Street",
            "Kreis": "County",
            "Regierungsbezirk": "District",
            "Address": "Address"
        },
        stores: {
            locationFinder: {
                name: "Location Finder",
                description: "Plugin for LocationFinder REST service from Esri CH.",
                placeHolder: "Place, address, POI..."
            },
            fields: {
                type: "Type",
                ort: "Place",
                plz: "Postal code",
                ote: "District",
                str: "Street",
                hnr: "House number",
                name: "Name",
                id: "ID",
                lan: "State",
                rbz: "District",
                krs: "County",
                gde: "Community"
            }
        }
    },
    "de": true
};

export type Messages = (typeof i18n)["root"];
export interface MessagesReference {
    get: () => Messages
}
export default i18n;
