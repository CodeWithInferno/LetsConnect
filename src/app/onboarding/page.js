"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GalleryVerticalEnd, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Cropper from "react-easy-crop";
import { SkillsInput } from "@/components/ui/SkillsInput";


// CountryCodeSelect Component
const allCountries = [
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+7", flag: "🇷🇺", name: "Russia" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  // Add more countries as needed
];

function CountryCodeSelect({ value, onValueChange }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-24">
        <SelectValue placeholder="Code" />
      </SelectTrigger>
      <SelectContent>
        {allCountries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.flag} {country.code} ({country.name})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    number: "",
    profilePicture: null,
    role: "",
    phoneExtension: "+1", // Default value added here
    interests: "",
    skills: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [image, setImage] = useState(null); // For the image to be cropped
  const [croppedImage, setCroppedImage] = useState(null); // For the cropped image preview
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();


  const checkUsernameAvailability = async (username) => {
    if (!username) return;

    try {
      const response = await fetch(`/api/user/check-username?username=${username}`);
      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error("Error checking username:", error);
    }
  };

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const response = await fetch("/api/user/check-profile");
        const data = await response.json();

        if (!data.onboardingNeeded) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    };

    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?page=1&query=technology&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setImages(data.results.map((img) => img.urls.regular));
        }
      } catch (error) {
        console.error("Error fetching Unsplash images:", error);
      }
    };

    if (images.length === 0) {
      fetchImages();
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropAndUpload = async () => {
    if (!image || !croppedAreaPixels) return;

    const croppedImageFile = await getCroppedImg(image, croppedAreaPixels);
    setCroppedImage(URL.createObjectURL(croppedImageFile)); // Display the cropped image

    // Update the form data with the cropped image file
    setFormData({ ...formData, profilePicture: croppedImageFile });
    setIsModalOpen(false);
  };

  const getCroppedImg = (imageSrc, crop) => {
    const image = new Image();
    image.src = imageSrc;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const maxSize = Math.max(image.width, image.height);
    canvas.width = maxSize;
    canvas.height = maxSize;

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      maxSize,
      maxSize
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], "profile-picture.jpg", {
          type: "image/jpeg",
        });
        resolve(file);
      }, "image/jpeg");
    });
  };

  
  const steps = [
    {
      id: 1,
      fields: (
        <>
          <Label htmlFor="name" className="text-lg font-semibold">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-2"
            required
          />
    
          <Label htmlFor="username" className="text-lg font-semibold mt-4">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Choose a unique username"
            value={formData.username}
            onChange={(e) => {
              setFormData({ ...formData, username: e.target.value });
              checkUsernameAvailability(e.target.value);
            }}
            className="mt-2"
            required
          />
          {usernameAvailable === false && (
            <p className="text-red-500 text-sm mt-1">Username already taken</p>
          )}
        </>
      ),
    },
    {
      id: 2,
      fields: (
        <>
          <Label htmlFor="phoneExtension" className="text-lg font-semibold">
            Phone Number
          </Label>
          <div className="flex gap-2 mt-2">
            <CountryCodeSelect
              value={formData.phoneExtension}
              onValueChange={(value) => {
                console.log("Selected country code:", value); // Add this
                setFormData({ ...formData, phoneExtension: value });
              }}
            />
            <Input
              id="number"
              type="text"
              placeholder="Enter your phone number"
              value={formData.number}
              onChange={(e) =>
                setFormData({ ...formData, number: e.target.value })
              }
              required
            />
          </div>
        </>
      ),
    },
    {
      id: 3,
      fields: (
        <>
          <Label htmlFor="profilePicture" className="text-lg font-semibold">
            Profile Picture
          </Label>
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={croppedImage} alt="Profile Picture" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current.click()}
            >
              Upload Image
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
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
        </>
      ),
    },
    {
      id: 4,
      fields: (
        <>
          <Label htmlFor="role" className="text-lg font-semibold">
            Role
          </Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value })}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Contributor">
                Contributor - Contribute to projects
              </SelectItem>
              <SelectItem value="Manager">
                Manager - Manage projects and teams
              </SelectItem>
            </SelectContent>
          </Select>
        </>
      ),
    },
    {
      id: 5,
      fields: (
        <>
      <Label className="text-lg font-semibold">Skills</Label>
      <SkillsInput
        value={formData.skills || []} // Ensure it's always an array
        onChange={(skills) => setFormData({ ...formData, skills })}
      />

      <Label className="text-lg font-semibold mt-4">Programming Languages</Label>
      <SkillsInput
        value={formData.programmingLanguages || []} // Ensure it's always an array
        onChange={(programmingLanguages) =>
          setFormData({ ...formData, programmingLanguages })
        }
      />

      </>
      ),
    },
    {
      id: 6,
      fields: (
        <>
          <Label htmlFor="timezone" className="text-lg font-semibold">
            Timezone
          </Label>
          <Select
            value={formData.timezone}
            onValueChange={(value) =>
              setFormData({ ...formData, timezone: value })
            }
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select your timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/New_York">
                Eastern Time (EST)
              </SelectItem>
              <SelectItem value="America/Los_Angeles">
                Pacific Time (PST)
              </SelectItem>
              <SelectItem value="Europe/London">GMT (London)</SelectItem>
              <SelectItem value="Asia/Kolkata">IST (India)</SelectItem>
            </SelectContent>
          </Select>
        </>
      ),
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let imageUrl = formData.profilePicture;
  
    // Upload Image Only If a New File Is Selected
    if (formData.profilePicture instanceof File) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", formData.profilePicture);
  
      try {
        const uploadResponse = await fetch("/api/user/uploadImage", {
          method: "POST",
          body: uploadFormData,
        });
  
        if (!uploadResponse.ok) {
          throw new Error("Image upload failed");
        }
  
        const { url } = await uploadResponse.json();
        imageUrl = url;
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload image.");
        return;
      }
    }
  
    const userData = {
      name: formData.name,
      username: formData.username,
      number: formData.number,
      phone_extension: formData.phoneExtension,
      profilePicture: imageUrl,
      role: formData.role,
      timezone: formData.timezone,
      
      // ✅ Ensure only strings are sent (Prisma needs string array)
      skills: formData.skills || [],
      programmingLanguages: formData.programmingLanguages || []
    };
    
  
    try {
      const response = await fetch("/api/user/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Profile creation failed");
      }
  
      const result = await response.json();
      console.log("Onboarding success:", result);
      alert("Profile created successfully!");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Onboarding error:", error);
      alert(error.message || "Failed to create profile. Please try again.");
    }
  };
  

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-6 p-8 md:p-12">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-5" />
            </div>
            LetsConnect
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-6">Complete Your Profile</h1>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-6">
                {steps[currentStep].fields}
                <div className="flex justify-between mt-6">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </Button>
                  )}
                  {currentStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2"
                    >
                      Next <ChevronRight className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        {images.length > 0 ? (
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
            <img
              src={images[currentStep % images.length]}
              alt="Onboarding Step"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Loading image...
          </div>
        )}
      </div>
    </div>
  );
}
