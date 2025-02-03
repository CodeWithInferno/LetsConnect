'use client';

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function RepositorySelector({ selectedRepo, onSelectRepo }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/github/repos");
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
          setRepos(data.repos);
        }
      } catch (err) {
        setError("Failed to fetch repositories.");
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if (loading) return <p>Loading repositories...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-2">
      <Label
        htmlFor="githubRepo"
        className="text-gray-700 dark:text-gray-300 font-medium"
      >
        GitHub Repository
      </Label>
      <Select value={selectedRepo} onValueChange={onSelectRepo}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select your repository" />
        </SelectTrigger>
        <SelectContent>
          {repos.map((repo) => (
            <SelectItem key={repo.id} value={repo.full_name}>
              {repo.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
