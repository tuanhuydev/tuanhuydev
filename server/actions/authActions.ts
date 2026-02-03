"use server";

import BaseError from "@lib/commons/errors/BaseError";
import { userRepository } from "@server/repositories/MongoUserRepository";
import { unstable_cache } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { authService } from "server/services/AuthService";
import { logService } from "server/services/LogService";

// Removed permission-related actions since permissions are being reworked
