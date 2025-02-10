"use client";

import { useState } from "react";
import { EditableField } from "@/components/ui/EditableField";
import { SkillsInput } from "@/components/ui/SkillsInput";
import { Button } from "@/components/ui/button";

export default function ProfileEdit({ userData, onProfileUpdate }) {
  // Local state so that editing doesn’t immediately change the global state.
  const [profile, setProfile] = useState({
    bio: userData.bio || "",
    website: userData.website || "",
    location: userData.location || "",
    // Assuming skills is an array of objects with a "name" property.
    skills: userData.skills?.map((s) => s.skill.name) || [],
  });

  // Update a single field in the profile state
  const handleFieldSave = (field, newValue) => {
    setProfile((prev) => ({ ...prev, [field]: newValue }));
  };

  // Update skills (using the SkillsInput component)
  const handleSkillsSave = (newSkills) => {
    setProfile((prev) => ({ ...prev, skills: newSkills }));
  };

  // Save the updated profile to your server
  const handleSaveProfile = async () => {
    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        // Handle error (e.g., show a toast or error message)
        console.error("Profile update failed.");
        return;
      }

      const updatedProfile = await response.json();
      if (onProfileUpdate) onProfileUpdate(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editable field for Bio */}
      <EditableField
        label="Bio"
        value={profile.bio}
        onSave={(newValue) => handleFieldSave("bio", newValue)}
      />

      {/* Editable field for Website */}
      <EditableField
        label="Website"
        value={profile.website}
        onSave={(newValue) => handleFieldSave("website", newValue)}
      />

      {/* Editable field for Location */}
      <EditableField
        label="Location"
        value={profile.location}
        onSave={(newValue) => handleFieldSave("location", newValue)}
      />

      {/* Skills selection via dropdown/multi-select */}
      <div className="border-b border-gray-300 dark:border-gray-700 pb-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">Skills</p>
        <SkillsInput
          value={profile.skills}
          onChange={(newSkills) => handleSkillsSave(newSkills)}
          placeholder="Select or type skills"
        />
      </div>

      <Button onClick={handleSaveProfile} className="w-full">
        Save Profile
      </Button>
    </div>
  );
}
