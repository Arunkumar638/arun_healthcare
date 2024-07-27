'use server'

import { ID, Query } from "node-appwrite";
import {InputFile} from "node-appwrite/file";
import { storage, users, databases } from "../appwrite.config";
import { parseStringify } from "@/lib/utils";
import { CreateUserParams, RegisterUserParams } from "@/types";
const {
  NEXT_DATABASE_ID,
  NEXT_PATIENT_COLLECTION_ID,
  NEXT_PROJECT_ID,
  NEXT_PUBLIC_BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT,
} = process.env;

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    console.log({ newUser });
    return parseStringify(newUser);
  } catch (error: any) {
    if (error && error?.code == 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);
      return existingUser?.users[0];
    }
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_PATIENT_COLLECTION_ID!,
      [
        Query.equal('userId',userId)
      ]
    );
    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get("blobFile") as Blob,
        identificationDocument?.get("fileName") as string
      );
      file = await storage.createFile(
        NEXT_PUBLIC_BUCKET_ID!,
        ID.unique(),
        inputFile
      );
    }
    console.log({
    
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${NEXT_PUBLIC_ENDPOINT}/storage/buckets/${NEXT_PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${NEXT_PROJECT_ID}`,
    })
    const newPatient = await databases.createDocument(
      NEXT_DATABASE_ID!,
      NEXT_PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${NEXT_PUBLIC_ENDPOINT}/storage/buckets/${NEXT_PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${NEXT_PROJECT_ID}`,
        ...patient
      }
    );
    return parseStringify(newPatient);
  } catch (error) {
    console.log(error);
  }
};
