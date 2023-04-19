import { Storage } from "@google-cloud/storage";
export const uploadFile = async (
  keyFilename: string,
  projectId: string,
  bucketName: string,
  localFilePath: string,
  exportType: string,
  generationMatchPrecondition = 0
) => {
  try {
    const storage = new Storage({
      keyFilename: keyFilename,
      projectId: projectId,
    });
    const options = {
      destination: "",
      // Optional:
      // Set a generation-match precondition to avoid potential race conditions
      // and data corruptions. The request to upload is aborted if the object's
      // generation number does not match your precondition. For a destination
      // object that does not yet exist, set the ifGenerationMatch precondition to 0
      // If the destination object already exists in your bucket, set instead a
      // generation-match precondition using its generation number.
      preconditionOpts: { ifGenerationMatch: generationMatchPrecondition },
    };

    console.log(
      "bucket name,",
      bucketName,
      "local file path ---->",
      localFilePath
    );

    const file_date = new Date().toISOString();
    const response = await storage.bucket(bucketName).upload(localFilePath, {
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
      destination: `/reports/quick-summary${file_date}.${exportType}`,
    });
    const public_url: string = response[0].metadata.selfLink;
    console.log("respobse ---->", response[0].metadata.selfLink);

    const publicUrl =
      "https://storage.googleapis.com/" +
      bucketName +
      "/" +
      "reports" +
      "/" +
      `quick-summary${file_date}.${exportType}`;
    console.log("testing url", publicUrl);
    return public_url;
  } catch (error) {
    console.log(`Error uploading the file:${error}`);
  }
};
