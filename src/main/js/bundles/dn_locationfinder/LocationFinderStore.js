/*
 * Copyright (C) 2025 con terra GmbH (info@conterra.de)
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
import d_lang from "dojo/_base/lang";
import d_array from "dojo/_base/array";
import fetch from "apprt-fetch";
import ct_when from "ct/_when";
import ct_geometry from "ct/mapping/geometry";
import Exception from "ct/Exception";
import ct_lang from "ct/_lang";
import ComplexQuery from "store-api/ComplexQuery";
import QueryResults from "dojo/store/util/QueryResults";
import { sort } from "store-api/utils";

/**
 * @fileOverview This file implements the dojo store to provide a search store for the locationfinder search service.
 */
const illegalArgumentError = Exception.illegalArgumentError;

export default class LocationFinderStore {
    /**
     * This store provides an interface for the location finder service.
     * @constructs
     * @param args arguments
     */
    constructor(/*Object*/args) {
        args = args || {};
        ct_lang.hasProp(args, "url", true, "Property 'url' is mandatory!");
        let i18n = (args._i18n && args._i18n.get()) || {};
        if (i18n.typeResolver) {
            this.typeResolver = i18n.typeResolver;
        }
        d_lang.mixin(this, args);
    }

    _extractContentFromQuery(query, options) {
        let ast = ComplexQuery.parse(query, options).ast;
        let walker = ast.walker();
        if (!walker.toFirstChild()) {
            throw illegalArgumentError("LocationFinderStore: No query found!");
        }
        let astNode = walker.current;
        let operation = astNode.o.substring(1);
        if (operation !== "suggest") {
            throw illegalArgumentError("LocationFinderStore: No 'suggest' query!");
        }
        let content = {
            type: "json",
            query: astNode.v
        };
        let qopts = walker.queryOptions;
        let count = qopts.count;
        if (count !== Infinity) {
            content.limit = count;
        }
        let start = qopts.start;
        if (start) {
            content.start = start;
        }
        d_lang.mixin(content, this.parameters);
        return content;
    }

    query(query, options) {
        let content = this._extractContentFromQuery(query, options);
        let promise = ct_when(fetch(this.url, {
            query: content,
            timeout: this.timeout
        }), function (response) {
            let total = response.count;
            let result = this._processSearchData(response);
            result = sort(result, options);
            result.total = total;
            return result;
        }, this);
        // need delegate, because the promise is frozen in chrome
        promise = d_lang.delegate(promise, {
            total: promise.then(function (result) {
                return result.total;
            })
        });
        return QueryResults(promise);
    }

    _processSearchData(data) {
        // check if response is okay
        if (!data.ok) {
            let msg = data.info;
            throw illegalArgumentError("LocationFinderStoreException:" + msg);
        }
        let wkid = this.wkid;
        let sref = data.sref;
        if (sref && !wkid) {
            if (ct_lang.isNumeric(sref)) {
                wkid = sref;
            } else if (sref instanceof String) {
                let index = data.sref.indexOf(":");
                wkid = index > -1 ? data.sref.substring(index + 1) : Number(data.sref);
            }
        }
        let items = data.locations || data.locs;
        if (!items) {
            throw illegalArgumentError("LocationFinderStore.parserException: 'locations' or 'locs' array not found in response!");
        }
        return d_array.map(items, function (item) {
            return this._prepareItem(item, wkid);
        }, this);
    }

    _prepareItem(item, wkid) {
        let resolveType = this.resolveType;
        let typeResolver = this.typeResolver;
        let newItem = d_lang.clone(item);
        // merge fields
        if (newItem.fields) {
            newItem = d_lang.mixin({}, newItem.fields, newItem);
            delete newItem.fields;
        }
        // add geometry
        newItem.geometry = ct_geometry.createPoint({
            x: newItem.cx,
            y: newItem.cy,
            wkid: wkid
        });
        // apply type resolved type
        let type = typeResolver[newItem.type] || newItem.type;
        if (resolveType && type) {
            newItem.type_resolved = type;
        }
        // set extent manually since it differs from the point
        // item.geometry.extent?
        //minx,miny,maxx,maxy,wkid
        newItem.extent = ct_geometry.createExtent(newItem.xmin, newItem.ymin, newItem.xmax, newItem.ymax, wkid);
        return newItem;
    }

    get(id) {
        //replace last /Lookup with /Lookation
        let url = this.url.replace(/\/Lookup$/i, "/Location");
        return ct_when(fetch(url, {
            query: {
                id: id
            }
        }), function (data) {
            return this._processSearchData(data)[0];
        }, this);
    }

    getIdentity(item) {
        ct_lang.hasProp(item, "id", true, "LocationFinderStore: Item has no 'id' property!");
        return item.id;
    }

    getMetadata() {
        let metadata = this.metadata || {};
        let url = this.url.replace(/\/Lookup$/, "/Version");
        let i18n = this._i18n.get().stores.fields;
        return ct_when(fetch(url, {
            timeout: this.timeout
        }), function (response) {
            let fields = (response.explicitFields || "").split(",");
            metadata.fields = d_array.map(fields, function (field) {
                return {
                    name: field,
                    title: i18n[field] || field,
                    type: "string"
                };
            }).concat(metadata.fields || []);
            return metadata;
        }, function (error) {
            throw illegalArgumentError("Error querying metadata from service!", error);
        }, this);
    }
}
