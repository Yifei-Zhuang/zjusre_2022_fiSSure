import ReactEchars from "echarts-for-react";
// material
import { Card, CardHeader, Box, Button } from "@mui/material";
import * as echarts from "echarts";
import axios from 'axios'
import { useEffect, useState } from "react";
import cloneDeep from 'lodash.clonedeep';
var code_2017p, code_2017l, code_2018p, code_2018l, code_2019p, code_2019l, code_2020p, code_2020l, code_2021p, code_2021l, code_2022p, code_2022l;
var ability_2017p, ability_2017l, ability_2018p, ability_2018l, ability_2019p, ability_2019l, ability_2020p, ability_2020l, ability_2021p, ability_2021l, ability_2022p, ability_2022l;
var config_2017p, config_2017l, config_2018p, config_2018l, config_2019p, config_2019l, config_2020p, config_2020l, config_2021p, config_2021l, config_2022p, config_2022l;
var doc_2017p, doc_2017l, doc_2018p, doc_2018l, doc_2019p, doc_2019l, doc_2020p, doc_2020l, doc_2021p, doc_2021l, doc_2022p, doc_2022l;
var test_2017p, test_2017l, test_2018p, test_2018l, test_2019p, test_2019l, test_2020p, test_2020l, test_2021p, test_2021l, test_2022p, test_2022l;
var robost_2017p, robost_2017l, robost_2018p, robost_2018l, robost_2019p, robost_2019l, robost_2020p, robost_2020l, robost_2021p, robost_2021l, robost_2022p, robost_2022l;
var maintainability_2017p, maintainability_2017l, maintainability_2018p, maintainability_2018l, maintainability_2019p, maintainability_2019l, maintainability_2020p, maintainability_2020l, maintainability_2021p, maintainability_2021l, maintainability_2022p, maintainability_2022l;
const HeatMap = () => {
    const init = async () => {
        const axios = require("axios");
        await Promise.all([
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "dependency"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "rebuild"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "add"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "implement"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "restruct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "construct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "feature"
                                    }
                                }
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2017-01-01 04:00:00",
                                            "lte": "2017-06-30 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                code_2017p = res.data.hits.total;
            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "dependency"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "rebuild"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "add"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "implement"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "restruct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "construct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "feature"
                                    }
                                }
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2017-07-01 04:00:00",
                                            "lte": "2018-01-01 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                code_2017l = res.data.hits.total;
            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "dependency"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "rebuild"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "add"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "implement"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "restruct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "construct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "feature"
                                    }
                                }
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2018-01-01 04:00:00",
                                            "lte": "2018-06-30 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                code_2018p = res.data.hits.total;
            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "dependency"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "rebuild"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "add"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "implement"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "restruct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "construct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "feature"
                                    }
                                }
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2018-07-01 04:00:00",
                                            "lte": "2019-01-01 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                code_2018l = res.data.hits.total;
            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "dependency"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "rebuild"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "add"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "implement"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "restruct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "construct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "feature"
                                    }
                                }
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2019-01-01 04:00:00",
                                            "lte": "2019-06-30 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                code_2019p = res.data.hits.total;
            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "dependency"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "rebuild"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "add"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "implement"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "restruct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "construct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "feature"
                                    }
                                }
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2019-07-01 04:00:00",
                                            "lte": "2020-01-01 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                code_2019l = res.data.hits.total;
            }).catch(e => {
                console.log('err', e)
            })])
        await Promise.all([
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "dependency"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "rebuild"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "add"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "implement"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "restruct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "construct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "feature"
                                    }
                                }
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2020-01-01 04:00:00",
                                            "lte": "2020-06-30 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                code_2020p = res.data.hits.total;
            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "dependency"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "rebuild"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "add"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "implement"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "restruct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "construct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "feature"
                                    }
                                }
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2020-07-01 04:00:00",
                                            "lte": "2021-01-01 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                code_2020l = res.data.hits.total;


            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "dependency"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "rebuild"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "add"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "implement"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "restruct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "construct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "feature"
                                    }
                                }
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2021-01-01 04:00:00",
                                            "lte": "2021-07-01 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                code_2021p = res.data.hits.total;


            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "dependency"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "rebuild"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "add"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "implement"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "restruct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "construct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "feature"
                                    }
                                }
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2021-07-01 04:00:00",
                                            "lte": "2022-01-01 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                code_2021l = res.data.hits.total;


            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "dependency"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "rebuild"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "add"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "implement"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "restruct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "construct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "feature"
                                    }
                                }
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2022-01-01 04:00:00",
                                            "lte": "2022-06-30 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                code_2022p = res.data.hits.total;


            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "dependency"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "rebuild"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "add"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "implement"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "restruct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "construct"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "feature"
                                    }
                                }
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2022-07-01 04:00:00",
                                            "lte": "2023-01-30 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                code_2022l = res.data.hits.total;


            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [{
                                "query_string": {
                                    "query": "support"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "standard"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "format"
                                }
                            },
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2017-01-01 04:00:00",
                                            "lte": "2017-06-30 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                maintainability_2017p = res.data.hits.total;


            }).catch(e => {
                console.log('err', e)
            })])
        await Promise.all([
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "support"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "standard"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "format"
                                    }
                                },
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2017-01-01 04:00:00",
                                            "lte": "2017-06-30 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                maintainability_2017p = res.data.hits.total;


            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "support"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "standard"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "format"
                                    }
                                },
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2017-07-01 04:00:00",
                                            "lte": "2018-01-01 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                maintainability_2017l = res.data.hits.total;


            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "support"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "standard"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "format"
                                    }
                                },
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2018-01-01 04:00:00",
                                            "lte": "2018-06-30 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                maintainability_2018p = res.data.hits.total;


            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "support"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "standard"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "format"
                                    }
                                },
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2018-07-01 04:00:00",
                                            "lte": "2019-01-01 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                maintainability_2018l = res.data.hits.total;


            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "support"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "standard"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "format"
                                    }
                                },
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2019-01-01 04:00:00",
                                            "lte": "2019-06-30 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                maintainability_2019p = res.data.hits.total;


            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "support"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "standard"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "format"
                                    }
                                },
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2019-07-01 04:00:00",
                                            "lte": "2020-01-01 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                maintainability_2019l = res.data.hits.total;


            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "support"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "standard"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "format"
                                    }
                                },
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2020-01-01 04:00:00",
                                            "lte": "2020-06-30 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                maintainability_2020p = res.data.hits.total;


            }).catch(e => {
                console.log('err', e)
            }),
            axios({
                method: "post",
                url: 'http://beet.asia:9200/doublec_pytorch/_search',
                data: {
                    "min_score": 0,
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "support"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "standard"
                                    }
                                },
                                {
                                    "query_string": {
                                        "query": "format"
                                    }
                                },
                            ],
                            "minimum_should_match": 1,
                            "filter": [
                                {
                                    "terms": {
                                        "_type": ["issues", "pulls"]
                                    }
                                },
                                {
                                    "term": {
                                        "repos_id": 65600975
                                    }
                                },
                                {
                                    "range": {
                                        "created_at": {
                                            "gte": "2020-07-01 04:00:00",
                                            "lte": "2021-01-01 04:59:59",
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(res => {
                maintainability_2020l = res.data.hits.total;


            }).catch(e => {
                console.log('err', e)
            })])
        await Promise.all([axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "support"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "standard"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "format"
                                }
                            },
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2021-01-01 04:00:00",
                                        "lte": "2021-07-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            maintainability_2021p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "support"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "standard"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "format"
                                }
                            },
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2021-07-01 04:00:00",
                                        "lte": "2022-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            maintainability_2021l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "support"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "standard"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "format"
                                }
                            },
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2022-01-01 04:00:00",
                                        "lte": "2022-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            maintainability_2022p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "support"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "standard"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "format"
                                }
                            },
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2022-07-01 04:00:00",
                                        "lte": "2023-01-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            maintainability_2022l = res.data.hits.total;

        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [{
                            "query_string": {
                                "query": "robust"
                            }
                        },
                        {
                            "query_string": {
                                "query": "error"
                            }
                        },
                        {
                            "query_string": {
                                "query": "fail"
                            }
                        },
                        {
                            "query_string": {
                                "query": "bug"
                            }
                        }],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2017-01-01 04:00:00",
                                        "lte": "2017-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            robost_2017p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "robust"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "error"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "fail"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "bug"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2017-07-01 04:00:00",
                                        "lte": "2018-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            robost_2017l = res.data.hits.total;

        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "robust"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "error"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "fail"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "bug"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2018-01-01 04:00:00",
                                        "lte": "2018-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            robost_2018p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "robust"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "error"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "fail"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "bug"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2018-07-01 04:00:00",
                                        "lte": "2019-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            robost_2018l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "robust"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "error"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "fail"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "bug"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2019-01-01 04:00:00",
                                        "lte": "2019-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            robost_2019p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "robust"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "error"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "fail"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "bug"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2019-07-01 04:00:00",
                                        "lte": "2020-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            robost_2019l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "robust"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "error"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "fail"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "bug"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2020-01-01 04:00:00",
                                        "lte": "2020-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            robost_2020p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "robust"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "error"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "fail"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "bug"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2020-07-01 04:00:00",
                                        "lte": "2021-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            robost_2020l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "robust"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "error"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "fail"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "bug"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2021-01-01 04:00:00",
                                        "lte": "2021-07-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            robost_2021p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "robust"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "error"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "fail"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "bug"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2021-07-01 04:00:00",
                                        "lte": "2022-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            robost_2021l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "robust"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "error"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "fail"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "bug"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2022-01-01 04:00:00",
                                        "lte": "2022-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            robost_2022p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "robust"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "error"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "fail"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "bug"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2022-07-01 04:00:00",
                                        "lte": "2023-01-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            robost_2022l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [{
                            "query_string": {
                                "query": "boost"
                            }
                        },
                        {
                            "query_string": {
                                "query": "speed"
                            }
                        },
                        {
                            "query_string": {
                                "query": "performance"
                            }
                        }],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2017-01-01 04:00:00",
                                        "lte": "2017-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            ability_2017p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "boost"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "speed"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "performance"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2017-07-01 04:00:00",
                                        "lte": "2018-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            ability_2017l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "boost"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "speed"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "performance"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2018-01-01 04:00:00",
                                        "lte": "2018-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            ability_2018p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        })])
        await Promise.all([axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "boost"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "speed"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "performance"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2018-07-01 04:00:00",
                                        "lte": "2019-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            ability_2018l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "boost"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "speed"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "performance"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2019-01-01 04:00:00",
                                        "lte": "2019-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            ability_2019p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "boost"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "speed"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "performance"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2019-07-01 04:00:00",
                                        "lte": "2020-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            ability_2019l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "boost"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "speed"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "performance"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2020-01-01 04:00:00",
                                        "lte": "2020-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            ability_2020p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "boost"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "speed"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "performance"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2020-07-01 04:00:00",
                                        "lte": "2021-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            ability_2020l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "boost"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "speed"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "performance"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2021-01-01 04:00:00",
                                        "lte": "2021-07-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            ability_2021p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "boost"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "speed"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "performance"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2021-07-01 04:00:00",
                                        "lte": "2022-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            ability_2021l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "boost"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "speed"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "performance"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2022-01-01 04:00:00",
                                        "lte": "2022-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            ability_2022p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "boost"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "speed"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "performance"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2022-07-01 04:00:00",
                                        "lte": "2023-01-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            ability_2022l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [{
                            "query_string": {
                                "query": "config"
                            }
                        },
                        {
                            "query_string": {
                                "query": "property"
                            }
                        },
                        {
                            "query_string": {
                                "query": "attribute"
                            }
                        }],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2017-01-01 04:00:00",
                                        "lte": "2017-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            config_2017p = res.data.hits.total;

        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "config"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "property"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "attribute"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2017-07-01 04:00:00",
                                        "lte": "2018-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            config_2017l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "config"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "property"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "attribute"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2018-01-01 04:00:00",
                                        "lte": "2018-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            config_2018p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "config"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "property"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "attribute"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2018-07-01 04:00:00",
                                        "lte": "2019-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            config_2018l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "config"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "property"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "attribute"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2019-01-01 04:00:00",
                                        "lte": "2019-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            config_2019p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "config"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "property"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "attribute"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2019-07-01 04:00:00",
                                        "lte": "2020-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            config_2019l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "config"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "property"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "attribute"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2020-01-01 04:00:00",
                                        "lte": "2020-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            config_2020p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "config"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "property"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "attribute"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2020-07-01 04:00:00",
                                        "lte": "2021-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            config_2020l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "config"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "property"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "attribute"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2021-01-01 04:00:00",
                                        "lte": "2021-07-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            config_2021p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "config"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "property"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "attribute"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2021-07-01 04:00:00",
                                        "lte": "2022-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            config_2021l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "config"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "property"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "attribute"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2022-01-01 04:00:00",
                                        "lte": "2022-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            config_2022p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        })])
        await Promise.all([axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "config"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "property"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "attribute"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2022-07-01 04:00:00",
                                        "lte": "2023-01-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            config_2022l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [{
                            "query_string": {
                                "query": "docs"
                            }
                        },
                        {
                            "query_string": {
                                "query": "typo"
                            }
                        }],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2017-01-01 04:00:00",
                                        "lte": "2017-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            doc_2017p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "docs"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "typo"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2017-07-01 04:00:00",
                                        "lte": "2018-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            doc_2017l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "docs"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "typo"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2018-01-01 04:00:00",
                                        "lte": "2018-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            doc_2018p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "docs"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "typo"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2018-07-01 04:00:00",
                                        "lte": "2019-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            doc_2018l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "docs"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "typo"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2019-01-01 04:00:00",
                                        "lte": "2019-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            doc_2019p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "docs"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "typo"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2019-07-01 04:00:00",
                                        "lte": "2020-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            doc_2019l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "docs"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "typo"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2020-01-01 04:00:00",
                                        "lte": "2020-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            doc_2020p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "docs"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "typo"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2020-07-01 04:00:00",
                                        "lte": "2021-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            doc_2020l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "docs"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "typo"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2021-01-01 04:00:00",
                                        "lte": "2021-07-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            doc_2021p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "docs"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "typo"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2021-07-01 04:00:00",
                                        "lte": "2022-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            doc_2021l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "docs"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "typo"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2022-01-01 04:00:00",
                                        "lte": "2022-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            doc_2022p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "docs"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "typo"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2022-07-01 04:00:00",
                                        "lte": "2023-01-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            doc_2022l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [{
                            "query_string": {
                                "query": "Unit Test"
                            }
                        },
                        {
                            "query_string": {
                                "query": "CI"
                            }
                        },
                        {
                            "query_string": {
                                "query": "Integration Test"
                            }
                        },
                        {
                            "query_string": {
                                "query": "Regression Test"
                            }
                        },
                        {
                            "query_string": {
                                "query": "pass"
                            }
                        }],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2017-01-01 04:00:00",
                                        "lte": "2017-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            test_2017p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "Unit Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "CI"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Integration Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Regression Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "pass"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2017-07-01 04:00:00",
                                        "lte": "2018-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            test_2017l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "Unit Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "CI"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Integration Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Regression Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "pass"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2018-01-01 04:00:00",
                                        "lte": "2018-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            test_2018p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "Unit Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "CI"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Integration Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Regression Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "pass"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2018-07-01 04:00:00",
                                        "lte": "2019-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            test_2018l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "Unit Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "CI"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Integration Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Regression Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "pass"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2019-01-01 04:00:00",
                                        "lte": "2019-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            test_2019p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "Unit Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "CI"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Integration Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Regression Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "pass"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2019-07-01 04:00:00",
                                        "lte": "2020-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            test_2019l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "Unit Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "CI"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Integration Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Regression Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "pass"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2020-01-01 04:00:00",
                                        "lte": "2020-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            test_2020p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "Unit Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "CI"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Integration Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Regression Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "pass"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2020-07-01 04:00:00",
                                        "lte": "2021-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            test_2020l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "Unit Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "CI"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Integration Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Regression Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "pass"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2021-01-01 04:00:00",
                                        "lte": "2021-07-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            test_2021p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        })])

        await Promise.all([axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "Unit Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "CI"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Integration Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Regression Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "pass"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2021-07-01 04:00:00",
                                        "lte": "2022-01-01 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            test_2021l = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "Unit Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "CI"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Integration Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Regression Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "pass"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2022-01-01 04:00:00",
                                        "lte": "2022-06-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            test_2022p = res.data.hits.total;


        }).catch(e => {
            console.log('err', e)
        }),
        axios({
            method: "post",
            url: 'http://beet.asia:9200/doublec_pytorch/_search',
            data: {
                "min_score": 0,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "query_string": {
                                    "query": "Unit Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "CI"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Integration Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "Regression Test"
                                }
                            },
                            {
                                "query_string": {
                                    "query": "pass"
                                }
                            }
                        ],
                        "minimum_should_match": 1,
                        "filter": [
                            {
                                "terms": {
                                    "_type": ["issues", "pulls"]
                                }
                            },
                            {
                                "term": {
                                    "repos_id": 65600975
                                }
                            },
                            {
                                "range": {
                                    "created_at": {
                                        "gte": "2022-07-01 04:00:00",
                                        "lte": "2023-01-30 04:59:59",
                                        "format": "yyyy-MM-dd HH:mm:ss"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(res => {
            test_2022l = res.data.hits.total;
        }).catch(e => {
            console.log('err', e)
        })])
    }
    var days_pie = ['2017-1', '2017-6', '2018-1', '2018-6', '2019-1', '2019-6', '2020-1', '2020-6', '2021-1', '2021-6', '2022-1', '2022-6'];
    // 数据[时间[相应评论条数]]

    // 评论态度索引
    var category_pie = ['代码', ' 可维护性', ' 鲁棒性', '性能', '配置', '文档', '测试'];
    var data_pie = [
        [442, 43, 32, 543, 43, 432, 34],
        [765, 343, 43, 354, 234, 45, 53],
        [342, 54, 324, 432, 65, 32, 43],
        [2344, 54, 565, 567, 23, 43, 67],
        [245, 56, 234, 453, 32, 65, 78],
        [442, 43, 32, 543, 43, 432, 34],
        [765, 343, 43, 354, 234, 45, 53],
        [342, 54, 324, 432, 65, 32, 43],
        [2344, 54, 565, 567, 23, 43, 67],
        [245, 56, 234, 453, 32, 65, 78],
        [465, 432, 78, 324, 56, 234, 463],
        [534, 42, 567, 32, 86, 324, 132]
    ];
    const DEFAULT_OPTION = {
        baseOption: {
            timeline: {
                axisType: 'category',
                // realtime: false,
                // loop: false,
                autoPlay: false,
                playInterval: 1000, //0.5s滚动一次
                // realtime = true,
                symbolSize: 1,
                // left: '5%',
                // right: '5%',
                // bottom: '0%',
                // width: '90%',
                // itemStyle: {
                //     borderWidth: 0
                // },
                controlStyle: {
                    show: false
                },
                data: days_pie,
                tooltip: {
                    formatter: days_pie
                },
            },
            // title: {
            //     text: '用户评论情感倾向分析',
            //     subtext: '数据来源于推特',
            //     left: 'center'
            // },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'horizontal',
                x: 'center',
                left: '42%',
                data: category_pie
            },
            graphic: {
                type: "text",
                left: "center",
                top: "45%",
            },
            series: [{
                name: 'tendency',
                type: 'pie',
                radius: ['50%', '65%'],
                // center: ['50%', '60%'],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        },
        options: []
    };
    for (var n = 0; n < 12; n++) {
        var res = [];
        for (var j = 0; j < 7; j++) {
            res.push({
                name: category_pie[j],
                value: data_pie[n][j]
            });
        }
        DEFAULT_OPTION.options.push({
            series: [{
                data: res,
                // 色彩方案--------------------------------------------------------------------------------
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = ['#EE4266', '#FFD23F', '#0EAD69', '#FFB200', '#8EE5EE', '#BA55D3', '#FF69B4'];
                            return colorList[params.dataIndex]
                        }
                    }
                }
            }]
        });
    }
    const [option, setOption] = useState(DEFAULT_OPTION);
    async function fetchData() {
        var newdata_pie = [];
        var code = [], maintainability = [], robost = [], ability = [], config = [], doc = [], test = [];
        code.push(code_2017p); code.push(code_2017l); code.push(code_2018p); code.push(code_2018l); code.push(code_2019p); code.push(code_2019l); code.push(code_2020p); code.push(code_2020l); code.push(code_2021p); code.push(code_2021l); code.push(code_2022p); code.push(code_2022l);
        maintainability.push(maintainability_2017p); maintainability.push(maintainability_2017l); maintainability.push(maintainability_2018p); maintainability.push(maintainability_2018l); maintainability.push(maintainability_2019p); maintainability.push(maintainability_2019l); maintainability.push(maintainability_2020p); maintainability.push(maintainability_2020l); maintainability.push(maintainability_2021p); maintainability.push(maintainability_2021l); maintainability.push(maintainability_2022p); maintainability.push(maintainability_2022l);
        robost.push(robost_2017p); robost.push(robost_2017l); robost.push(robost_2018p); robost.push(robost_2018l); robost.push(robost_2019p); robost.push(robost_2019l); robost.push(robost_2020p); robost.push(robost_2020l); robost.push(robost_2021p); robost.push(robost_2021l); robost.push(robost_2022p); robost.push(robost_2022l);
        ability.push(ability_2017p); ability.push(ability_2017l); ability.push(ability_2018p); ability.push(ability_2018l); ability.push(ability_2019p); ability.push(ability_2019l); ability.push(ability_2020p); ability.push(ability_2020l); ability.push(ability_2021p); ability.push(ability_2021l); ability.push(ability_2022p); ability.push(ability_2022l);
        config.push(config_2017p); config.push(config_2017l); config.push(config_2018p); config.push(config_2018l); config.push(config_2019p); config.push(config_2019l); config.push(config_2020p); config.push(config_2020l); config.push(config_2021p); config.push(config_2021l); config.push(config_2022p); config.push(config_2022l);
        doc.push(doc_2017p); doc.push(doc_2017l); doc.push(doc_2018p); doc.push(doc_2018l); doc.push(doc_2019p); doc.push(doc_2019l); doc.push(doc_2020p); doc.push(doc_2020l); doc.push(doc_2021p); doc.push(doc_2021l); doc.push(doc_2022p); doc.push(doc_2022l);
        test.push(test_2017p); test.push(test_2017l); test.push(test_2018p); test.push(test_2018l); test.push(test_2019p); test.push(test_2019l); test.push(test_2020p); test.push(test_2020l); test.push(test_2021p); test.push(test_2021l); test.push(test_2022p); test.push(test_2022l);

        for (var i = 0; i < 12; i++) {
            newdata_pie[i] = [];
            newdata_pie[i].push(code[i]);
            newdata_pie[i].push(maintainability[i]);
            newdata_pie[i].push(robost[i]);
            newdata_pie[i].push(ability[i]);
            newdata_pie[i].push(config[i]);
            newdata_pie[i].push(doc[i]);
            newdata_pie[i].push(test[i]);
        }
        const newOption = cloneDeep(option);
        newOption.options = []
        for (var n = 0; n < 12; n++) {
            var res = [];
            for (var j = 0; j < 7; j++) {
                res.push({
                    name: category_pie[j],
                    value: newdata_pie[n][j]
                });
            }


            newOption.options.push({
                series: [{
                    data: res,
                    // 色彩方案--------------------------------------------------------------------------------
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = ['#EE4266', '#FFD23F', '#0EAD69', '#FFB200', '#8EE5EE', '#BA55D3', '#FF69B4'];
                                return colorList[params.dataIndex]
                            }
                        }
                    }
                }]
            });

        }
        setOption(newOption);
    }
    useEffect(() => {
        // setTimeout(() => {
        const inner = async () => {
            await init();
            await fetchData()
        }
        inner()
        // }, 3000);
    }, []);

    return (

        <Card>

            <CardHeader title="HeatMap" />

            <Box id="Heatmap" sx={{ p: 3, pb: 1 }} dir="ltr">

                <ReactEchars option={option} id="mycharts" ></ReactEchars>
            </Box>
        </Card>
    );


};

export default HeatMap;
