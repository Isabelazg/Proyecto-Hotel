/**
 * Respuesta exitosa estándar
 */
export const successResponse = (res, data, statusCode = 200, meta = null, links = null, message = null) => {
  const response = {
    status: 'success',
    data
  };

  if (message) {
    response.message = message;
  }

  if (meta) {
    response.meta = meta;
  }

  if (links) {
    response.links = links;
  }

  return res.status(statusCode).json(response);
};

/**
 * Respuesta de error estándar
 */
export const errorResponse = (res, message, statusCode = 500, errors = []) => {
  const response = {
    status: 'error',
    message
  };

  if (errors.length > 0) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Formatea datos en formato JSON:API
 */
export const formatJsonApiData = (data, attributes = []) => {
  if (Array.isArray(data)) {
    return data.map(item => formatSingleItem(item, attributes));
  }
  return formatSingleItem(data, attributes);
};

const formatSingleItem = (item, attributes) => {
  if (!item) return null;

  const formatted = {};
  
  attributes.forEach(attr => {
    if (item[attr] !== undefined) {
      formatted[attr] = item[attr];
    } else if (item.dataValues && item.dataValues[attr] !== undefined) {
      formatted[attr] = item.dataValues[attr];
    }
  });

  return formatted;
};
