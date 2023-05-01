const { number } = require('joi');
const Joi = require('joi');

const AssignmentSchema = (data) => {
    const Schema = Joi.object({
        subjectName: Joi.string().required().trim().min(3).max(150),
        description: Joi.string().required().min(3).max(150),
        stream: Joi.string().required(),
        // assignment: Joi.string().required().min(3).max(150),
        // assignmentNum: Joi.string().required(),
    }).unknown();

    return Schema.validate(data);
};

module.exports = { AssignmentSchema };