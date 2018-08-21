/*
 * Copyright (C) 2018 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import registerSuite from "intern!object";
import assert from "intern/chai!assert";
import md from "module";
import require from "require";
import ct_when from "ct/_when";
import LocationFinderStore from "../LocationFinderStore";

registerSuite({
    name: md.id,
    "location finder store": {
        "query": function () {
            let url = require.toUrl("./LocationFinder_Response.json");
            let locationFinderStore = new LocationFinderStore({
                url: url, wkid: 32632, typeResolver: {
                    "Gemeinde": "Community",
                    "TopoName": "Topographical name",
                    "Ort": "Place",
                    "Stra\u00DFe": "Street",
                    "Kreis": "County",
                    "Regierungsbezirk": "District",
                    "Adresse": "Address"
                }
            });
            return ct_when(locationFinderStore.query({address: {$suggest: "*"}}), function (response) {
                return assert.strictEqual(372, response.total);
            });
        }
    }
});
