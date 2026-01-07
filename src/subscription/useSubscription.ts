import { useEffect } from "react";
import { useSubscriptionStore } from "./subscription.store";
import { useAuthStore } from "../auth/auth.store";
import { useNavigation } from "@react-navigation/native";

// export const useSubscription = () => {
//   const { subscription } = useAuthStore();
//   const subStore = useSubscriptionStore();

//   useEffect(() => {
//     subStore.refreshFromAuth();
//   }, [subscription]);

//   return {
//     isPremium: subStore.isPremium,
//     isExpired: subStore.isExpired,
//     expiresAt: subStore.expiresAt,
//   };
// };

export const useSubscriptionGuard = () => {
  const { isPremium, isExpired } = useSubscriptionStore();
  const navigation = useNavigation<any>();

  if (!isPremium || isExpired) {
    navigation.navigate("Paywall");
    return false;
  }

  return true;
};