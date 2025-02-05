"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastViewport,
} from "@/components/ui/toast";
import { Sparkles, Stars } from "lucide-react";
import DisplayCard from "@/components/projects/DisplayCard";
import RepositorySelector from "./RepositorySelector";
import { SkillsInput } from "@/components/ui/SkillsInput";

export default function ProjectForm({ userData }) {
  const [toastMessage, setToastMessage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectType: "",
    organizationId: "",
    skillsRequired: [],
    languages: [],
    deadline: "",
    budget: "",
    certificateEligible: false,
    bannerImage: null, // This holds the preview URL
    githubRepo: "",
  });

  const [organizations, setOrganizations] = useState([]);
  const [bannerPreview, setBannerPreview] = useState(null); // Preview of the uploaded image

  const handleRepoSelect = (selectedRepo) => {
    setFormData((prev) => ({ ...prev, githubRepo: selectedRepo }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSkillChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      skillsRequired: value.split(",").map((skill) => skill.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/project/create", {
        method: "POST", // Ensure this is POST
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Send the form data
      });

      if (!response.ok) {
        setToastMessage({
          title: "Error",
          description: "An error occurred while creating the project.",
          variant: "destructive",
        });
        return;
      }

      const data = await response.json();
      setToastMessage({
        title: "Success",
        description: "Project created successfully!",
      });
    } catch (error) {
      console.error(error);
      setToastMessage({
        title: "Error",
        description: "Something went wrong!",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setToastMessage({
          title: "Invalid File Type",
          description: "Please upload a valid image file.",
          variant: "destructive",
        });
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        // Send file to the server
        const response = await fetch("/api/project/uploadImage", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Image upload failed");
        }

        const { url } = await response.json(); // Server should return the URL
        setFormData((prev) => ({
          ...prev,
          bannerImage: url, // Set the bannerImage to the uploaded URL
        }));
        setBannerPreview(url); // Show preview from the uploaded URL
      } catch (error) {
        console.error("Error uploading image:", error);
        setToastMessage({
          title: "Error",
          description: "Failed to upload the image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <ToastProvider>
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="relative">
          {/* Gradient background effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl dark:from-blue-500/10 dark:to-purple-500/10" />

          <form
            onSubmit={handleSubmit}
            className="relative space-y-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-8 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">
                Create a New Project
              </h1>
            </div>
            {/* Banner Image Upload */}
            <div className="space-y-2">
              <Label
                htmlFor="bannerImage"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Upload Banner Image (16:9 Aspect Ratio)
              </Label>
              <Input
                id="bannerImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full transition-all duration-300 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 hover:border-blue-400 dark:hover:border-blue-500"
              />
              {bannerPreview && (
                <div
                  className="w-full rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  <img
                    src={bannerPreview}
                    alt="Banner Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            <RepositorySelector
              selectedRepo={formData.githubRepo}
              onSelectRepo={handleRepoSelect}
            />

            {/* Project Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Project Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter project title"
                className="w-full transition-all duration-300 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 hover:border-blue-400 dark:hover:border-blue-500"
                required
              />
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Project Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the project in detail"
                className="w-full min-h-[120px] transition-all duration-300 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 hover:border-blue-400 dark:hover:border-blue-500"
                required
              />
            </div>

            {/* Project Type */}
            <div className="space-y-2">
              <Label
                htmlFor="projectType"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Project Type
              </Label>
              <Select
                name="projectType"
                value={formData.projectType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, projectType: value }))
                }
                required
              >
                <SelectTrigger className="w-full transition-all duration-300 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 hover:border-blue-400 dark:hover:border-blue-500">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open-source">Open Source</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Two Column Layout for Skills and Languages */}
            {/* Skills & Programming Languages Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Skills Required */}
              <div className="space-y-2">
                <Label
                  htmlFor="skillsRequired"
                  className="text-gray-700 dark:text-gray-300 font-medium"
                >
                  Skills Required
                </Label>
                <SkillsInput
                  value={formData.skillsRequired}
                  onChange={(skills) =>
                    setFormData((prev) => ({ ...prev, skillsRequired: skills }))
                  }
                  placeholder="Select or type skills"
                />
              </div>

              {/* Programming Languages */}
              <div className="space-y-2">
                <Label
                  htmlFor="languages"
                  className="text-gray-700 dark:text-gray-300 font-medium"
                >
                  Programming Languages
                </Label>
                <SkillsInput
                  value={formData.languages}
                  onChange={(languages) =>
                    setFormData((prev) => ({ ...prev, languages }))
                  }
                  placeholder="Select or type programming languages"
                />
              </div>
            </div>

            {/* Two Column Layout for Deadline and Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Deadline */}
              <div className="space-y-2">
                <Label
                  htmlFor="deadline"
                  className="text-gray-700 dark:text-gray-300 font-medium"
                >
                  Deadline
                </Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full transition-all duration-300 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 hover:border-blue-400 dark:hover:border-blue-500"
                  required
                />
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label
                  htmlFor="budget"
                  className="text-gray-700 dark:text-gray-300 font-medium"
                >
                  Budget (Optional)
                </Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Enter budget"
                  className="w-full transition-all duration-300 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 hover:border-blue-400 dark:hover:border-blue-500"
                />
              </div>
            </div>

            {/* Certificate Eligibility */}
            <div className="flex items-center space-x-2 py-4">
              <Checkbox
                id="certificateEligible"
                name="certificateEligible"
                checked={formData.certificateEligible}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    certificateEligible: checked,
                  }))
                }
                className="h-5 w-5 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <div className="flex items-center gap-2">
                <Stars className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <Label
                  htmlFor="certificateEligible"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Contributors are eligible for a certificate
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              Create Project
            </Button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="sticky top-6 space-y-4">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Project Preview
          </h2>
          <DisplayCard project={formData} />
        </div>
      </div>
    </ToastProvider>
  );
}
