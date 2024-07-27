import * as sdk from 'node-appwrite';
import {
  NEXT_PROJECT_ID,
  NEXT_API_KEY,
  NEXT_DATABASE_ID,
  NEXT_PATIENT_COLLECTION_ID,
  NEXT_DOCTOR_COLLECTION_ID,
  NEXT_APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID as BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT as ENDPOINT
} from "../../config"

const client = new sdk.Client();

client
.setEndpoint(ENDPOINT!)
.setProject(NEXT_PROJECT_ID!)
.setKey(NEXT_API_KEY!)

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);