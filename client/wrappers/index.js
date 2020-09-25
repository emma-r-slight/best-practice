import {
  register,
  signIn,
  getDecodedToken,
  isAuthenticated,
  logOff,
} from "authenticare/client";

import config from "../config";

import { getEntries, getEntryById, addEntry } from "../api";

import makeAuthenticationWrapper from "./authentication";
import makeEntriesContextWrapper from "./entriesContext";
import makeEntryContextWrapper from "./entryContext";
import makeUserContextWrapper from "./userContext";

export const authentication = makeAuthenticationWrapper(isAuthenticated);
export const entriesContext = makeEntriesContextWrapper(getEntries);
export const entryContext = makeEntryContextWrapper(getEntryById, addEntry);
export const userContext = makeUserContextWrapper(
  configuredRegister,
  configuredSignIn,
  getDecodedToken,
  isAuthenticated,
  logOff
);

// FOR: wrappedWith([authentication, userContext], SignIn)
export function wrappedWith(wrappers, Component) {
  const remaining = ([, ...rest]) => rest;
  if (!wrappers.length) return Component;
  return wrappers[0](wrappedWith(remaining(wrappers), Component));
}

// FOR: wrappedWith(authentication, userContext)(SignIn)
// export function wrappedWith(...wrappers) {
//   const remaining = ([, ...rest]) => rest;
//   const wrap = (wrappers, Component) => {
//     if (!wrappers.length) return Component;
//     return wrappers[0](wrap(remaining(wrappers), Component));
//   };
//   return function (Comp) {
//     return wrap(wrappers, Comp);
//   };
// }

function configuredRegister(credentials) {
  const { username, password } = credentials;
  const userData = { username, password };
  return register(userData, { baseUrl: config.baseApiUrl });
}

function configuredSignIn(credentials) {
  const { username, password } = credentials;
  const userData = { username, password };
  return signIn(userData, { baseUrl: config.baseApiUrl });
}