import { unref } from "vue";

import { useAuthService } from "@/authuser/services";

export function useAuthHelpers() {
  const { userId: currentUserId } = useAuthService();

  return {
    getIsCurrentUser,
  };
}
