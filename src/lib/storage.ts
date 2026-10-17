import "@tanstack/react-start/server-only";
import { STORAGE_BUCKET, STORAGE_ENPOINT, STORAGE_KEY_ID, STORAGE_KEY_SECRET } from "@/lib/server-env";
import { AwsClient } from "aws4fetch";

const client = new AwsClient({
  accessKeyId: STORAGE_KEY_ID,
  secretAccessKey: STORAGE_KEY_SECRET,
  service: "s3",
  region: "auto",
});

export async function getStorageObject(key: string): Promise<Response> {
  const url = new URL(`/${STORAGE_BUCKET}/${key}`, STORAGE_ENPOINT);
  return client.fetch(url);
}

export async function putStorageObject(key: string, body: BodyInit, headers?: HeadersInit): Promise<Response> {
  const url = new URL(`/${STORAGE_BUCKET}/${key}`, STORAGE_ENPOINT);
  return client.fetch(url, {
    method: "PUT",
    body,
    headers,
  });
}

export async function deleteStorageObject(key: string): Promise<Response> {
  const url = new URL(`/${STORAGE_BUCKET}/${key}`, STORAGE_ENPOINT);
  return client.fetch(url, {
    method: "DELETE",
  });
}
