const structure = (
  data: any
): { keys: string[]; valueMap: Map<string, Map<string, number>> } => {
  const keys = new Map<string, number>();
  const valueMap: Map<string, Map<string, number>> = new Map();

  const extractKeys = (obj: any, parentKey: string = ""): void => {
    if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        const value = obj[key];
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof obj[fullKey] !== "object") {
          keys.set(fullKey, (keys.get(fullKey) || 0) + 1);
        }

        if (!valueMap.has(fullKey)) {
          valueMap.set(fullKey, new Map<string, number>());
        }

        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          extractKeys(value, fullKey);
        } else if (Array.isArray(value) && typeof value[0] === "object") {
          extractKeys(value[0], fullKey);
        } else {
          const innerMap = valueMap.get(fullKey)!;
          const stringValue = value?.toString() || "";
          innerMap.set(stringValue, (innerMap.get(stringValue) || 0) + 1);
        }
      }
    }
  };

  if (Array.isArray(data)) {
    data.forEach((item) => extractKeys(item));
  } else {
    extractKeys(data);
  }
  console.log("keys")
  console.log(keys);
  return {
    keys: Array.from(keys.keys()),
    valueMap,
  };
};

export default structure;
