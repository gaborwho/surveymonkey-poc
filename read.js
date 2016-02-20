'use strict';

require('dotenv').config();

const SurveyMonkeyAPI = require('surveymonkey').SurveyMonkeyAPI;
const Promise = require('bluebird');
const co = require('co');

const apiKey = process.env.API_KEY;
const accessToken = process.env.ACCESS_TOKEN

const apiOptions = { version : 'v2', secure : true };

co(function*() {
  try {
    const api = Promise.promisifyAll(new SurveyMonkeyAPI(apiKey, accessToken, apiOptions));

    const surveyList = yield api.getSurveyListAsync({});
    const surveyId = surveyList.data.surveys[0].survey_id;

    const surveyDetails = yield api.getSurveyDetailsAsync({ survey_id: surveyId });

    const respondentList = yield api.getRespondentListAsync({
      survey_id: surveyId,
      order_by: 'date_modified', order_asc: true,
      page_size: 25
    });

    const respondentId = respondentList.data.respondents[0].respondent_id;
    const responses = yield api.getResponsesAsync({ respondent_ids: [respondentId], survey_id: surveyId, order_asc: true, page_size: 25 })

    console.log(JSON.stringify({ surveyDetails: surveyDetails.data, responses: responses.data }, null, 2));
  } catch (error) {
    console.log(error.message);
  }
});

