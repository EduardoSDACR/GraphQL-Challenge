import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  DOMAIN_NAME: Joi.string().default(''),
  JWT_SECRET_KEY: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.string().default('30m'),
});
