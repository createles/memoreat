import { v2 as cloudinary } from 'cloudinary';

// We specify that this function takes a Node Buffer and a string,
// and promises to return a string (the URL) when it's done.
export async function uploadImageToCloudinary(buffer: Buffer, filename: string): Promise<string> {

    // We return a new Promise wrapper
    return new Promise((resolve, reject) => {

        // We open a stream to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'memoreat', // The folder name in your Cloudinary dashboard
                public_id: filename.split('.')[0], // Cloudinary doesn't want the .jpg extension
            },
            (error, result) => {
                // This callback runs when Cloudinary is finished!
                if (error) {
                    reject(error); // It failed! Reject the Promise.
                } else if (result) {
                    resolve(result.secure_url); // It succeeded! Resolve with the secure URL.
                } else {
                    reject(new Error("Cloudinary upload failed: No result returned"));
                }
            }
        );

        // Finally, we pour our image buffer into the stream we just opened
        uploadStream.end(buffer);
    });
}