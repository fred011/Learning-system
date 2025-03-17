import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { isTeacher } from "@/lib/teacher";

const f = createUploadthing();

const handleAuth = async () => {
  console.log("🔹 handleAuth is being called!");

  try {
    const { userId } = await auth();
    console.log("🔹 Clerk Auth Response:", { userId });

    const isAuthorized = await isTeacher(userId);

    if (!userId || !isAuthorized) {
      throw new Error("❌ Unauthorized");
    }

    console.log("✅ User authenticated:", userId);
    return { userId };
  } catch (error) {
    console.error("❌ Authentication failed:", error);
    throw new Error("Authentication error");
  }
};

console.log("🚀 UploadThing API route is running!");

// Handle file upload and YouTube URL separately
export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      console.log("🔥 Middleware for courseImage is running!", req.headers);
      return handleAuth();
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("✅ Upload complete for userId:", metadata.userId);
      console.log("📂 File URL:", file.ufsUrl);
      return { fileUrl: file.ufsUrl };
    }),

  courseAttachment: f({
    text: { maxFileSize: "512MB", maxFileCount: 5 },
    image: { maxFileSize: "512MB", maxFileCount: 3 },
    video: { maxFileSize: "512MB", maxFileCount: 1 },
    audio: { maxFileSize: "512MB", maxFileCount: 2 },
    pdf: { maxFileSize: "512MB", maxFileCount: 3 },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(({ metadata, file }) => {
      console.log("✅ Upload complete for userId:", metadata.userId);
      console.log("📂 File URL:", file.ufsUrl);
      return { fileUrl: file.ufsUrl };
    }),

  // Handle YouTube URLs separately
  // chapterVideo: f({})
  //   .middleware(() => handleAuth())
  //   .onUploadComplete(({ metadata, file }) => {
  //     // Check if youtubeUrl is passed in the metadata
  //     const youtubeUrl = metadata?.youtubeUrl;

  //     if (youtubeUrl) {
  //       console.log("✅ YouTube URL received for userId:", metadata.userId);
  //       console.log("📂 YouTube Video URL:", youtubeUrl); // metadata stores the YouTube URL
  //       return { youtubeUrl }; // Return YouTube URL
  //     }

  //     // Handle file URL if no YouTube URL is provided
  //     console.log("✅ File upload complete for userId:", metadata.userId);
  //     console.log("📂 File URL:", file.ufsUrl);
  //     return { fileUrl: file.ufsUrl }; // Return file URL if no YouTube URL
  //   }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
