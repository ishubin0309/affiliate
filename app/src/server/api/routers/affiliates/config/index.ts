import { Storage } from "@google-cloud/storage";
import path from "path";
export const uploadFile = async (
  keyFilename: string,
  projectId: string,
  bucketName: string,
  generic_filename: string,
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

    // console.log(
    //   "bucket name,",
    //   bucketName,
    //   "local file path ---->",
    //   generic_filename
    // );

    const localFileName = path.join(
      __dirname,
      `../../../../../src/server/api/routers/affiliates/config/generated/${generic_filename}.${exportType}`
    );

    console.log("local file name ----->", localFileName);
    // const file_date = new Date().toISOString();
    const response = await storage.bucket(bucketName).upload(localFileName, {
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
      destination: `/${generic_filename}.${exportType}`,
    });
    const public_url: string = response[0].metadata.mediaLink;
    console.log("respobse ---->", response[0].metadata);

    const publicUrl =
      "https://storage.googleapis.com/" +
      bucketName +
      "/" +
      `${generic_filename}.${exportType}`;
    console.log("testing url", publicUrl);
    return public_url;
  } catch (error) {
    console.log(`Error uploading the file:${error}`);
  }
};

export async function uploadCsvToGcs(
  bucketName: string,
  filePath: string,
  csvData: any
) {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filePath);

  await file.save(csvData, {
    contentType: "text/csv",
    resumable: false,
    validation: "crc32c",
  });

  console.log(`File ${filePath} uploaded to ${bucketName}.`);
}
