'use server'

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(
    appwriteConfig.databseId,
    appwriteConfig.userCollectionId,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const createAccount = async ({
  email,
  fullName,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);
  const accountId = await sendEmailOTP({ email });
  if (!accountId) {
    throw new Error("Failed to send an OTP");
  }
  if (!existingUser) {
    const { databases } = await createAdminClient();
    await databases.createDocument(
      appwriteConfig.databseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar:
          "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dprofile%2Bplaceholder&psig=AOvVaw34mJW8mch-pJU5ZqZI4_oe&ust=1733876623006000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOCwy_X3m4oDFQAAAAAdAAAAABAQ",
        accountId,
      }
    );
  }

  return parseStringify({ accountId });
};

const handleError = (error: unknown, message: string) => {
  console.log({ error, message });
  throw error;
};
