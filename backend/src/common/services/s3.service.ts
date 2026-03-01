import path from "node:path";

import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";
import { v4 as randomUUID } from "uuid";

import { mainConfig } from "../configs/main.config";
import { FileItemEnum } from "../enums/file-item.enum";

class S3Service {
    private readonly client = new S3Client({
        region: mainConfig.AWS_S3_REGION,
        credentials: {
            accessKeyId: mainConfig.AWS_S3_ACCESS_KEY,
            secretAccessKey: mainConfig.AWS_S3_SECRET_KEY,
        },
    });

    public async uploadFile(
        file: UploadedFile,
        itemType: FileItemEnum,
        itemId: string,
    ): Promise<string> {
        try {
            const filePath = this.buildPath(itemType, itemId, file.name);
            await this.client.send(
                new PutObjectCommand({
                    Bucket: mainConfig.AWS_S3_BUCKET_NAME,
                    Key: filePath,
                    Body: file.data,
                    ContentType: file.mimetype,
                    ACL: mainConfig.AWS_S3_ACL,
                }),
            );

            return filePath;
        } catch (error) {
            console.error("Error upload: ", error);
        }
    }

    public async deleteFile(filePath: string): Promise<string> {
        try {
            await this.client.send(
                new DeleteObjectCommand({
                    Bucket: mainConfig.AWS_S3_BUCKET_NAME,
                    Key: filePath,
                }),
            );
            return filePath;
        } catch (error) {
            console.error("Error deleting file from S3: ", error);
        }
    }

    private buildPath(
        itemType: FileItemEnum,
        itemId: string,
        fileName: string,
    ): string {
        return `${itemType}/${itemId}/${randomUUID()}${path.extname(fileName)}`;
    }
}

export const s3Service = new S3Service();
