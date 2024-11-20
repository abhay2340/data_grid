const resolveValue = (item: any, pathSegments: string[]): any => {
  let value = item;
  for (const key of pathSegments) {
    if (Array.isArray(value)) {
      return value.map((arrayItem) => resolveValue(arrayItem, [key]));
    } else if (typeof value === "object" && value !== null && key in value) {
      value = value[key];
    } else {
      return "";
    }
  }
  return value;
};

export const getValue = (obj: any, path: string): string => {
  const value = resolveValue(obj, path.split("."));
  return value;
};
