
export const formatName = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const getUserGender = (name: string) => {
  // More comprehensive list of female name patterns
  const femaleNamePatterns = ['a', 'ia', 'na', 'ina', 'ela', 'ita', 'isa'];
  const lastName = name.split(' ').pop()?.toLowerCase() || '';
  
  // First check if the person's name is "Alirio Aguirre Ariza"
  if (name.toLowerCase().includes("alirio") && name.toLowerCase().includes("ariza")) {
    return 'male';
  }
  
  for (const pattern of femaleNamePatterns) {
    if (lastName.endsWith(pattern)) {
      return 'female';
    }
  }
  return 'male';
};
