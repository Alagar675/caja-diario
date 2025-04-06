
export const formatName = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const getUserGender = (name: string) => {
  const femaleNamePatterns = ['a', 'ia', 'na', 'ina', 'ela'];
  const lastName = name.split(' ').pop()?.toLowerCase() || '';
  
  for (const pattern of femaleNamePatterns) {
    if (lastName.endsWith(pattern)) {
      return 'female';
    }
  }
  return 'male';
};
