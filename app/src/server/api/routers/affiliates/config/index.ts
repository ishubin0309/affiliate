import { Storage } from "@google-cloud/storage";
export const uploadFile = async (
  keyFilename: string,
  projectId: string,
  bucketName: string,
  generic_filename: string,
  exportType: string,
  generationMatchPrecondition = 0,
  tmpFile: string
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

    const localFileName = `${tmpFile}${generic_filename}.${exportType}`;
    const response = await storage.bucket(bucketName).upload(localFileName, {
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
      destination: `/${generic_filename}.${exportType}`,
    });

    const public_url: string = response[0].metadata.mediaLink;

    return public_url;
  } catch (error) {
    console.log(`Error uploading the file:${error}`);
  }
};
