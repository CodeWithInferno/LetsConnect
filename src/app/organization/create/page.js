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
import { SkillsInput } from "@/components/ui/SkillsInput"; // If you want to reuse the skills input
// Or create an IndustryInput for organizations if you want different logic.

const allCountries = [
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  // ...
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

export default function OrganizationOnboardingForm() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // We can store the "current step" if we want the same multi-step approach
  const [currentStep, setCurrentStep] = useState(0);

  // For the background images, if you want them
  const [images, setImages] = useState([]);

  // Basic organization data
  const [formData, setFormData] = useState({
    orgName: "",
    slug: "",
    phoneExtension: "+1",
    number: "",
    logoFile: null,
    industry: "",
    location: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // etc...
  });

  // For cropping
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // For slug availability
  const [slugAvailable, setSlugAvailable] = useState(null);

  // ------------------------------
  // Check onboarding status
  useEffect(() => {
    const checkOrgOnboardingStatus = async () => {
      try {
        const response = await fetch("/api/organization/check-profile");
        const data = await response.json();
        if (!data.onboardingNeeded) {
          router.push("/org-dashboard");
        }
      } catch (error) {
        console.error("Error checking org onboarding status:", error);
      }
    };

    checkOrgOnboardingStatus();
  }, [router]);

  // ------------------------------
  // Fetch random images if you want them as a background
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?page=1&query=company&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}`
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
  }, [images]);

  // ------------------------------
  // Slug check
  const checkSlugAvailability = async (slug) => {
    if (!slug) return;
    try {
      const response = await fetch(`/api/organization/check-slug?slug=${slug}`);
      const data = await response.json();
      setSlugAvailable(data.available);
    } catch (error) {
      console.error("Error checking org slug:", error);
    }
  };

  // ------------------------------
  // File change / cropping
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
    setFormData({ ...formData, logoFile: croppedImageFile });
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
        const file = new File([blob], "logo.jpg", {
          type: "image/jpeg",
        });
        resolve(file);
      }, "image/jpeg");
    });
  };

  // ------------------------------
  // Steps
  const steps = [
    {
      id: 1,
      fields: (
        <>
          <Label htmlFor="orgName" className="text-lg font-semibold">
            Organization Name
          </Label>
          <Input
            id="orgName"
            type="text"
            placeholder="Enter your organization's name"
            value={formData.orgName}
            onChange={(e) =>
              setFormData({ ...formData, orgName: e.target.value })
            }
            className="mt-2"
            required
          />

          <Label htmlFor="slug" className="text-lg font-semibold mt-4">
            Organization Slug (Unique)
          </Label>
          <Input
            id="slug"
            type="text"
            placeholder="Choose a unique slug (e.g., 'my-company')"
            value={formData.slug}
            onChange={(e) => {
              setFormData({ ...formData, slug: e.target.value });
              checkSlugAvailability(e.target.value);
            }}
            className="mt-2"
            required
          />
          {slugAvailable === false && (
            <p className="text-red-500 text-sm mt-1">Slug already taken</p>
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
                setFormData({ ...formData, phoneExtension: value });
              }}
            />
            <Input
              id="number"
              type="text"
              placeholder="Enter your org phone number"
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
          <Label htmlFor="logo" className="text-lg font-semibold">
            Organization Logo
          </Label>
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={croppedImage} alt="Organization Logo" />
              <AvatarFallback>ORG</AvatarFallback>
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
                <DialogTitle>Crop Your Logo</DialogTitle>
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
          <Label htmlFor="industry" className="text-lg font-semibold">
            Industry
          </Label>
          <Select
            value={formData.industry}
            onValueChange={(value) =>
              setFormData({ ...formData, industry: value })
            }
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IT Services">IT Services</SelectItem>
              <SelectItem value="Software">Software</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              {/* ... */}
            </SelectContent>
          </Select>
        </>
      ),
    },
    {
      id: 5,
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
              <SelectValue placeholder="Select timezone" />
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
              {/* ... */}
            </SelectContent>
          </Select>
        </>
      ),
    },
  ];

  // ------------------------------
  // Step Controls
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

  // ------------------------------
  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let logoUrl = null;

    if (formData.logoFile instanceof File) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", formData.logoFile);

      try {
        // 1) Upload to your image upload endpoint
        const uploadResponse = await fetch("/api/organization/uploadLogo", {
          method: "POST",
          body: uploadFormData,
        });

        const contentType = uploadResponse.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await uploadResponse.text();
          throw new Error(`Invalid response: ${text.slice(0, 100)}`);
        }

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error);
        }

        const { url } = await uploadResponse.json();
        logoUrl = url;
      } catch (error) {
        console.error("Upload error:", error);
        alert(error.message || "Logo upload failed");
        return;
      }
    }

    // 2) Prepare org data
    const orgData = {
      orgName: formData.orgName,
      slug: formData.slug,
      phone_extension: formData.phoneExtension,
      number: formData.number,
      logoUrl,
      industry: formData.industry,
      location: formData.location,
      timezone: formData.timezone,
    };

    // 3) Submit to /api/organization/onboard
    try {
      const response = await fetch("/api/organization/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orgData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Org registration failed");
      }

      const result = await response.json();
      console.log("Org Onboarding success:", result);
      alert("Organization created successfully!");
      window.location.href = "/org-dashboard";
    } catch (error) {
      console.error("Onboarding error:", error);
      alert(error.message || "Failed to create organization. Please try again.");
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Side */}
      <div className="flex flex-col gap-6 p-8 md:p-12">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-5" />
            </div>
            LetsConnect for Organizations
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-6">Create Your Organization</h1>
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

      {/* Right Side (Image) */}
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
