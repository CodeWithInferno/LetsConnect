// lib/utils.js
export const getLanguageColor = (language) => {
    const colors = {
      TypeScript: "#3178c6",
      JavaScript: "#f1e05a",
      CSS: "#563d7c",
      Python: "#3572A5",
      HTML: "#e34c26",
      Ruby: "#701516",
      Java: "#b07219",
      PHP: "#4F5D95",
      Go: "#00ADD8",
      Rust: "#dea584"
    };
    return colors[language] || "#cccccc";
  };