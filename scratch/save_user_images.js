import fs from "fs";

const run = async () => {
  try {
    const base64Data = "data:image/jpeg;base64,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";
    
    // 1. Write the decoded base64 image as 6.jpg
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Clean, "base64");
    const dest6 = "client/public/assets/architecture/6.jpg";
    fs.writeFileSync(dest6, buffer);
    console.log("Successfully decoded and wrote painting to:", dest6);

    // 2. Download and write the second modernist image as 7.jpg
    const url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCY_x9PFWfztJoAW7s94kcNnX130js4eIitw&s";
    const dest7 = "client/public/assets/architecture/7.jpg";
    console.log("Downloading modernist building image...");
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to download image");
    const arrayBuffer = await response.arrayBuffer();
    fs.writeFileSync(dest7, Buffer.from(arrayBuffer));
    console.log("Successfully downloaded and wrote building image to:", dest7);

    process.exit(0);
  } catch (error) {
    console.error("Error saving user images:", error.message);
    process.exit(1);
  }
};

run();
