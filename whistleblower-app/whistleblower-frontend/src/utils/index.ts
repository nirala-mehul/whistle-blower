import { ADMIN } from "../constants";

export function isAdmin(currentAccount?: any) {
  return currentAccount !== undefined && ADMIN === currentAccount.address;
}

export function shortenTextWithEllipses(text: string) {
  if (text.length < 12) return text;

  // Extract the first 6 characters
  const firstPart = text.substring(0, 6);

  // Extract the last 6 characters
  const lastPart = text.substring(text.length - 6);

  // Create the final masked string
  const maskedString = `${firstPart}...${lastPart}`;

  return maskedString;
}
