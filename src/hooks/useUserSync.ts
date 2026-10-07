import { useUserStore } from "@/store/userStore";
import { useUser } from "@clerk/expo";
import { useEffect } from "react";
import { useSupabase } from "./useSupabase";

export const useUserSync = () => {
  const { user } = useUser();
  const setIsAdmin = useUserStore((state) => state.setIsAdmin);
  const setIsAdminLoaded = useUserStore((state) => state.setIsAdminLoaded);
  const authSupabase = useSupabase();

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setIsAdmin(false);
      setIsAdminLoaded(true);
      return;
    }

    const syncUser = async () => {
      setIsAdminLoaded(false);

      try {
        const { data, error } = await authSupabase
          .from("users")
          .select("clerk_id, is_admin")
          .eq("clerk_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("useUserSync SELECT error:", error);
          if (!cancelled) setIsAdminLoaded(true);
          return;
        }

        if (data) {
          if (!cancelled) {
            setIsAdmin(data.is_admin ?? false);
            setIsAdminLoaded(true);
          }
          return;
        }

        const email = user.emailAddresses[0]?.emailAddress;
        if (!email) {
          console.error("useUserSync: Clerk user has no email address");
          if (!cancelled) setIsAdminLoaded(true);
          return;
        }

        const { data: newUser, error: insertError } = await authSupabase
          .from("users")
          .insert({
            clerk_id: user.id,
            email,
            first_name: user.firstName,
            last_name: user.lastName,
            avatar_url: user.imageUrl,
          })
          .select("is_admin")
          .single();

        if (insertError) {
          console.error("useUserSync INSERT error:", insertError);
          if (!cancelled) setIsAdminLoaded(true);
          return;
        }

        if (!cancelled) {
          setIsAdmin(newUser?.is_admin ?? false);
          setIsAdminLoaded(true);
        }
      } catch (error) {
        console.error("useUserSync unexpected error:", error);
        if (!cancelled) setIsAdminLoaded(true);
      }
    };

    void syncUser();

    return () => {
      cancelled = true;
    };
  }, [authSupabase, setIsAdmin, setIsAdminLoaded, user]);
};
