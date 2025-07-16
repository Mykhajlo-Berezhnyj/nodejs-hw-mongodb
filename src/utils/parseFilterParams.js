const parseName = (value) => {
  const isString = typeof value === 'string';
  if (isString) return value.trim();
  return undefined;
};

const parseNumber = (value) => {
  const isString = typeof value === 'string';
  if (!isString) return undefined;
  const parsedNumber = parseInt(value);
  if (Number.isNaN(parsedNumber)) {
    return undefined;
  }
  return parsedNumber;
};

const parseBoolean = (value) => {
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  return undefined;
};

const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isType = (type) => ['work', 'home', 'personal'].includes(type);
  if (isType(type)) return type;
  return undefined;
};

export const parseFilterParams = (query) => {
  return {
    name: parseName(query.name),
    phoneNumber: parseName(query.phoneNumber),
    email: parseName(query.email),
    isFavourite: parseBoolean(query.isFavourite),
    contactType: parseType(query.contactType),
    createdAt: parseNumber(query.createdAt),
    updatedAt: parseNumber(query.updatedAt),
  };
};
