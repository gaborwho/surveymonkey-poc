'use strict';

require('dotenv').config();

var SurveyMonkeyAPI = require('surveymonkey').SurveyMonkeyAPI;
var Promise = require('bluebird');
 
var apiKey = process.env.API_KEY;
var accessToken = process.env.ACCESS_TOKEN

var api;
var surveyId;
 
Promise.resolve()
  .then(function () {
    api = Promise.promisifyAll(new SurveyMonkeyAPI(apiKey, accessToken, { version : 'v2', secure : true }));
  })
  .then(function () {
    return api.getSurveyListAsync({});
  })
  .then(function (data) {
    surveyId = data.data.surveys[0].survey_id;
    return api.getRespondentListAsync({ survey_id: surveyId, order_by: 'date_modified', order_asc: true, page_size: 25 })
  })
  .then(function (data) {
    var respondentId = data.data.respondents[0].respondent_id;
    return api.getResponsesAsync({ respondent_ids: [respondentId], survey_id: surveyId, order_asc: true, page_size: 25 })
  })
  .then(function (data) {
    console.log(JSON.stringify(data));
  })
  .catch(function(error) {
    console.log(error.message);
  });

