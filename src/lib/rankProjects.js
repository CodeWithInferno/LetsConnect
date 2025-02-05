/**
 * Computes a score for a project based on the user's preferences.
 * The scoring is based on matching the user's interests, skills, and programming languages
 * to the project's title, description, skillsRequired, and languages.
 *
 * @param {object} user - The user object, expected to have:
 *   - interests: A comma-separated string (e.g., "React, Node.js")
 *   - skills: An array of skill objects with a `name` property.
 *   - programmingLanguages: An array of strings (each a known programming language).
 * @param {object} project - The project object, expected to have:
 *   - title: The project's title.
 *   - description: The project's description.
 *   - skillsRequired: An array of skill objects with a `name` property.
 *   - languages: An array of strings (each a programming language).
 *   - projectType: (Optional) A string describing the project type.
 * @returns {number} A numeric score representing the relevance of the project.
 */
function scoreProjectForUser(user, project) {
  let score = 0;

  // Score based on user's interests (if provided)
  if (user.interests) {
    const interests = user.interests
      .toLowerCase()
      .split(",")
      .map((s) => s.trim());

    interests.forEach((interest) => {
      if (project.title.toLowerCase().includes(interest)) score += 3;
      if (project.description.toLowerCase().includes(interest)) score += 2;
    });
  }

  // Score based on user's skills (if available)
  if (user.skills && Array.isArray(user.skills)) {
    const userSkillNames = user.skills.map((skill) => skill.name.toLowerCase());

    if (Array.isArray(project.skillsRequired)) {
      project.skillsRequired.forEach((reqSkill) => {
        if (userSkillNames.includes(reqSkill.toLowerCase())) score += 5;
      });
    }
  }

  // Score based on user's programming languages (if available)
  if (user.programmingLanguages && Array.isArray(user.programmingLanguages)) {
    const userLanguages = user.programmingLanguages.map((lang) => lang.toLowerCase());

    if (Array.isArray(project.languages)) {
      project.languages.forEach((lang) => {
        if (userLanguages.includes(lang.toLowerCase())) score += 3;
      });
    }
  }

  // Optional: Score based on projectType matching user role (if applicable)
  if (user.role && project.projectType) {
    if (project.projectType.toLowerCase().includes(user.role.toLowerCase())) {
      score += 2;
    }
  }

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
    console.log(`📌 Project '${project.title}' scored:`, score);
    return { ...project, score };
  });

  // Sort projects so that those with higher scores come first.
  scoredProjects.sort((a, b) => b.score - a.score);

  console.log("📌 Projects After Ranking:", scoredProjects);
  return scoredProjects;
}
