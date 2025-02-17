/**
 * Computes a score for a project based on the user's preferences.
 * The scoring is based on matching the user's interests, skills, and programming languages
 * to the project's title, description, skillsRequired, and languages.
 *
 * @param {object} user - The user object. It can have:
 *   - interests: Either a comma-separated string (e.g., "React, Node.js")
 *                or an array of objects with a `name` property.
 *   - skills: An array of skill objects with a `name` property.
 *   - programmingLanguages: An array of strings or objects (with a `name` property).
 *   - role: (Optional) A string representing the user’s role.
 * @param {object} project - The project object. Expected properties:
 *   - title: The project's title.
 *   - description: The project's description.
 *   - skillsRequired: An array of objects with a `name` property.
 *   - languages: An array of objects with a `name` property.
 *   - projectType: (Optional) A string describing the project type.
 * @returns {number} A numeric score representing the relevance of the project.
 */
function scoreProjectForUser(user, project) {
  let score = 0;

  // ----- Interests -----
  let interests = [];
  if (user.interests) {
    // If interests is a string, split it by comma
    if (typeof user.interests === "string") {
      interests = user.interests
        .toLowerCase()
        .split(",")
        .map((s) => s.trim());
    }
    // If it's an array (e.g., [{ name: "React" }, { name: "Node.js" }])
    else if (Array.isArray(user.interests)) {
      interests = user.interests.map((interestObj) =>
        interestObj.name ? interestObj.name.toLowerCase() : ""
      );
    }
  }

  interests.forEach((interest) => {
    if (project.title.toLowerCase().includes(interest)) {
      score += 3;
      console.log(`✅ Interest Match: '${interest}' in title`);
    }
    if (project.description.toLowerCase().includes(interest)) {
      score += 2;
      console.log(`✅ Interest Match: '${interest}' in description`);
    }
  });

  // ----- Skills -----
  let userSkillNames = [];
  if (user.skills && Array.isArray(user.skills)) {
    // Assuming user.skills is an array of objects with a `name` property.
    userSkillNames = user.skills.map((skill) => skill.name.toLowerCase());
  }
  if (project.skillsRequired && Array.isArray(project.skillsRequired)) {
    project.skillsRequired.forEach((reqSkill) => {
      // reqSkill is expected to be an object with a name property.
      if (
        reqSkill.name &&
        userSkillNames.includes(reqSkill.name.toLowerCase())
      ) {
        score += 5;
        console.log(`✅ Skill Match: '${reqSkill.name}'`);
      }
    });
  }

  // ----- Programming Languages -----
  let userLanguages = [];
  if (user.programmingLanguages && Array.isArray(user.programmingLanguages)) {
    userLanguages = user.programmingLanguages.map((lang) => {
      // Handle both strings and objects with a name property
      if (typeof lang === "string") return lang.toLowerCase();
      if (lang.name) return lang.name.toLowerCase();
      return "";
    });
  }
  if (project.languages && Array.isArray(project.languages)) {
    project.languages.forEach((lang) => {
      let langName = "";
      if (typeof lang === "string") {
        langName = lang.toLowerCase();
      } else if (lang.name) {
        langName = lang.name.toLowerCase();
      }
      if (langName && userLanguages.includes(langName)) {
        score += 3;
        console.log(`✅ Language Match: '${langName}'`);
      }
    });
  }

  // ----- Optional: Project Type Matching -----
  if (user.role && project.projectType) {
    if (
      project.projectType.toLowerCase().includes(user.role.toLowerCase())
    ) {
      score += 2;
      console.log(`✅ Role Match: '${user.role}' in projectType`);
    }
  }

  console.log(`📌 Final score for '${project.title}':`, score);
  return score;
}

/**
 * Ranks projects by computing a score for each project based on the user's
 * preferences and then sorting the projects in descending order.
 *
 * @param {object} user - The user object.
 * @param {Array<object>} projects - An array of project objects.
 * @returns {Array<object>} A new array of projects sorted by relevance.
 */
export function rankProjects(user, projects) {
  console.log("📌 User Data:", user);
  console.log("📌 Projects Before Ranking:", projects);

  // Map each project to include a computed score.
  const scoredProjects = projects.map((project) => {
    const score = scoreProjectForUser(user, project);
    return { ...project, score };
  });

  // Sort projects so that those with higher scores come first.
  scoredProjects.sort((a, b) => b.score - a.score);

  console.log("📌 Projects After Ranking:", scoredProjects);
  return scoredProjects;
}
