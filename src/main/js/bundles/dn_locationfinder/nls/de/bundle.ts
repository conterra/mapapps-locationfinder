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

import { Messages } from "../bundle";

export default {
    bundleName: "Esri CH Location Finder",
    bundleDescription: "Mit Hilfe der Standortsuche kann ein Ort auf der Karte gesucht werden. Der Anwender gibt dazu einen Suchbegriff in ein Textfeld ein und w\u00E4hrend der Eingabe werden ihm passende Suchergebnisse vorgeschlagen.",
    typeResolver: {
        "Gemeinde": "Gemeinde",
        "TopoName": "Topografischer Name",
        "Ort": "Ort",
        "Stra\u00DFe": "Stra\u00DFe",
        "Kreis": "Kreis",
        "Regierungsbezirk": "Regierungsbezirk",
        "Address": "Adresse"
    },
    stores: {
        locationFinder: {
            name: "Standortsuche",
            description: "Plugin f\u00FCr den Standortsuchdienst der Esri CH.",
            placeHolder: "Ort, Adresse, POI..."
        },
        fields: {
            type: "Typ",
            ort: "Ort",
            plz: "Postleitzahl",
            ote: "Ortsteil",
            str: "Stra\u00DFe",
            hnr: "Hausnummer",
            name: "Name",
            id: "ID",
            lan: "Bundesland",
            rbz: "Regierungsbezirk",
            krs: "Kreis",
            gde: "Gemeinde"
        }
    }
} satisfies Messages;
