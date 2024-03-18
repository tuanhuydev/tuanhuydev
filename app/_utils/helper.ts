export const makeFieldMap = (fields: Array<Object>) => {
  const fieldMap = new Map();
  fields.forEach(({ name, ...restFields }: any) => fieldMap.set(name[0], restFields));
  return fieldMap;
};
