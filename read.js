'use strict';

var SurveyMonkeyAPI = require('surveymonkey').SurveyMonkeyAPI;
var Promise = require('bluebird');
 
var apiKey = process.env.API_KEY;
var accessToken = process.env.ACCESS_TOKEN
 
try { 
    var api = Promise.promisifyAll(new SurveyMonkeyAPI(apiKey, accessToken, { version : 'v2', secure : true }));
} catch (error) {
    console.log(error.message);
    process.exit();
}

 
Promise.resolve()
  .then(function () {
    return api.getSurveyListAsync({});
  })
  .then(function (data) {
    var surveyId = data.data.surveys[0].survey_id;
    return api.getRespondentListAsync({ survey_id: surveyId, order_by: 'date_modified', order_asc: true, page_size: 25 })
  })
  .then(function (data) {
    console.log(data.data.respondents[0].respondent_id);
  })
  .catch(function(error) {
    console.log(error.message);
  });

