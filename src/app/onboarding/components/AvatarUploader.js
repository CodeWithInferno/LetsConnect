// "use client";
// import { useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import Cropper from "react-easy-crop";

// export function AvatarUploader({ onUpload }) {
//   const [image, setImage] = useState(null);
//   const [croppedImage, setCroppedImage] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImage(reader.result);
//         setIsModalOpen(true);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const onCropComplete = (croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   };

//   const handleCropAndUpload = async () => {
//     if (!image || !croppedAreaPixels) return;

//     const croppedImage = await getCroppedImg(image, croppedAreaPixels);
//     setCroppedImage(croppedImage);

//     // Upload to Cloudinary
//     const formData = new FormData();
//     formData.append("file", croppedImage);
//     formData.append("upload_preset", "your_upload_preset");

//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );
//       const data = await response.json();
//       onUpload(data.secure_url); // Pass the uploaded image URL to the parent component
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   };

//   const getCroppedImg = (imageSrc, crop) => {
//     const image = new Image();
//     image.src = imageSrc;

//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     const maxSize = Math.max(image.width, image.height);
//     canvas.width = maxSize;
//     canvas.height = maxSize;

//     ctx.drawImage(
//       image,
//       crop.x,
//       crop.y,
//       crop.width,
//       crop.height,
//       0,
//       0,
//       maxSize,
//       maxSize
//     );

//     return new Promise((resolve) => {
//       canvas.toBlob((blob) => {
//         resolve(blob);
//       }, "image/jpeg");
//     });
//   };

//   return (
//     <div className="flex flex-col items-center gap-4">
//       <Avatar className="h-24 w-24">
//         <AvatarImage src={croppedImage} alt="Profile Picture" />
//         <AvatarFallback>CN</AvatarFallback>
//       </Avatar>
//       <Button
//         type="button"
//         variant="outline"
//         onClick={() => fileInputRef.current.click()}
//       >
//         Upload Image
//       </Button>
//       <input
//         type="file"
//         accept="image/*"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         className="hidden"
//       />

//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Crop Your Image</DialogTitle>
//           </DialogHeader>
//           <div className="relative h-64 w-full">
//             <Cropper
//               image={image}
//               crop={crop}
//               zoom={zoom}
//               aspect={1}
//               onCropChange={setCrop}
//               onCropComplete={onCropComplete}
//               onZoomChange={setZoom}
//               cropShape="round"
//             />
//           </div>
//           <div className="flex justify-end gap-2">
//             <Button variant="outline" onClick={() => setIsModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleCropAndUpload}>Save</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }









"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Cropper from "react-easy-crop";

export function AvatarUploader({ onUpload }) {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

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

    // Pass the cropped image file back to the parent component
    onUpload(croppedImageFile);
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
        const file = new File([blob], "profile-picture.jpg", { type: "image/jpeg" });
        resolve(file);
      }, "image/jpeg");
    });
  };

  return (
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
    </div>
  );
}