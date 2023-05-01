/* eslint-disable camelcase */
const sgMail = require('@sendgrid/mail');
const moment = require('moment');
const Banner = require('../models/Banner');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const joiErrorFormatter = (RawErrors) => {
  const errors = {};
  const Details = RawErrors.details;
  /* eslint-disable array-callback-return */
  Details.map((detail) => {
    errors[detail.path] = [detail.message];
  });
  /* eslint-enable array-callback-return */
  return errors;
};

const validateInput = (schema, data) => {
  const validInput = schema(data, { abortEarly: false });

  if (validInput.error) {
    return joiErrorFormatter(validInput.error);
  }
  return validInput;
};

const ScheduleTask = async () => {
  const today = moment();
  // const alive_banners = [];
  const alive_banners = await Banner.find({
    liveDates: today,
    status: 'active',
  }).select('id');

  /* eslint-disable no-restricted-syntax */
  /* eslint-disable no-await-in-loop */
  for (const banners of alive_banners) {
    await Banner.findByIdAndUpdate(banners.id, {
      status: 'expired',
    });
  }
};

module.exports = { validateInput, ScheduleTask };
