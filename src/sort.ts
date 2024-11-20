const sort = (key: string, valueMap: Map<string, Map<string, number>>): [string, number][] => {
    const innerMap = valueMap.get(key);
    if (!innerMap) return [];
  
    const entries = Array.from(innerMap.entries());
  
    for (let i = 0; i < entries.length; i++) {
      for (let j = 0; j < entries.length - i - 1; j++) {
        if (entries[j][1] < entries[j + 1][1]) {
          const temp = entries[j];
          entries[j] = entries[j + 1];
          entries[j + 1] = temp;
        }
      }
    }
  
    return entries;
  };
  
  export default sort;
  