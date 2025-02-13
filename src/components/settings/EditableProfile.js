"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Camera } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Cropper from "react-easy-crop"
import { SkillsInput } from "@/components/ui/SkillsInput"

export default function EditProfileForm({ initialData, onProfileUpdated, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    website: "",
    location: "",
    profile_picture: "",
    skills: [],
    interests: [],
  })
  const [allSkills, setAllSkills] = useState([])
  const [allInterests, setAllInterests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [image, setImage] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        username: initialData.username || "",
        bio: initialData.bio || "",
        website: initialData.website || "",
        location: initialData.location || "",
        profile_picture: initialData.profile_picture || "",
        skills: initialData.skills ? initialData.skills.map(({ skill }) => skill.name) : [],
        interests: initialData.interests ? initialData.interests.map(({ interest }) => interest.name) : [],
      })
      setCroppedImage(initialData.profile_picture || null)
    }
  }, [initialData])

  useEffect(() => {
    async function fetchSkillsAndInterests() {
      try {
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query {
                allSkills {
                  id
                  name
                }
                interests {
                  interest {
                    id
                    name
                  }
                }
              }
            `,
          }),
        })
        const json = await res.json()
        if (json.data && json.data.allSkills) {
          setAllSkills(json.data.allSkills.map((skill) => skill.name))
        }
        if (json.data && json.data.allInterests) {
          setAllInterests(json.data.allInterests.map((interest) => interest.name))
        }
      } catch (e) {
        console.error("Error fetching skills and interests:", e)
      }
    }
    fetchSkillsAndInterests()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSkillsChange = (selectedSkills) => {
    setFormData((prev) => ({ ...prev, skills: selectedSkills }))
  }

  const handleInterestsChange = (selectedInterests) => {
    setFormData((prev) => ({ ...prev, interests: selectedInterests }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result)
        setIsModalOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleCropAndUpload = async () => {
    if (!image || !croppedAreaPixels) return

    const croppedImageFile = await getCroppedImg(image, croppedAreaPixels)
    setCroppedImage(URL.createObjectURL(croppedImageFile))
    setFormData((prev) => ({ ...prev, profile_picture: croppedImageFile }))
    setIsModalOpen(false)
  }

  const getCroppedImg = (imageSrc, crop) => {
    const image = new Image()
    image.src = imageSrc
    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        canvas.width = crop.width
        canvas.height = crop.height
        ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
        canvas.toBlob((blob) => {
          const file = new File([blob], "profile-picture.jpg", { type: "image/jpeg" })
          resolve(file)
        }, "image/jpeg")
      }
    })
  }

  const isValidWebsite = (urlString) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch (err) {
      return false;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let website = formData.website.trim();
      // Validate the website: if provided, it must be a valid URL with http:// or https://.
      if (website && !isValidWebsite(website)) {
        setError("Please enter a valid website URL (must include http:// or https://).");
        setLoading(false);
        return;
      }
  
      let imageUrl = formData.profile_picture;
  
      if (formData.profile_picture instanceof File) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", formData.profile_picture);
  
        const uploadResponse = await fetch("/api/user/uploadImage", {
          method: "POST",
          body: uploadFormData,
        });
  
        if (!uploadResponse.ok) {
          throw new Error("Image upload failed");
        }
  
        const { url } = await uploadResponse.json();
        imageUrl = url;
      }
  
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation UpdateProfile($input: UpdateProfileInput!) {
              updateProfile(input: $input) {
                id
                name
                username
                bio
                website
                location
                profile_picture
                skills {
                  skill {
                    id
                    name
                  }
                }
                interests {
                  interest {
                    id
                    name
                  }
                }
              }
            }
          `,
          variables: {
            input: {
              name: formData.name,
              username: formData.username,
              bio: formData.bio,
              website,
              location: formData.location,
              profile_picture: imageUrl,
              skills: formData.skills,
              interests: formData.interests,
            },
          },
        }),
      });
      const json = await res.json();
      if (json.errors) {
        throw new Error(json.errors[0].message);
      }
      onProfileUpdated(json.data.updateProfile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 cursor-pointer relative group" onClick={() => fileInputRef.current.click()}>
              <AvatarImage src={croppedImage} alt="Profile Picture" />
              <AvatarFallback>{formData.name?.[0] || "U"}</AvatarFallback>
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Camera className="text-white" />
              </div>
            </Avatar>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crop Your Image</DialogTitle>
              </DialogHeader>
              <div className="relative h-64 w-full">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCropAndUpload}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" value={formData.username} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" value={formData.website} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <SkillsInput value={formData.skills} onChange={handleSkillsChange} suggestions={allSkills} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests">Interests</Label>
            <SkillsInput value={formData.interests} onChange={handleInterestsChange} suggestions={allInterests} />
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}







