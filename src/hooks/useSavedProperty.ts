import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@clerk/expo";
import { useCallback, useEffect, useState } from "react";

export function useSavedProperty(propertyId: string, onUnsave?: () => void) {
  const { userId } = useAuth();
  const authSupabase = useSupabase();

  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const checkIfSaved = useCallback(async () => {
    if (!userId || !propertyId) {
      setIsSaved(false);
      return;
    }

    const { data, error } = await authSupabase
      .from("saved_properties")
      .select("id")
      .eq("user_clerk_id", userId)
      .eq("property_id", propertyId)
      .maybeSingle();
    if (error) {
      console.error("Error checking saved property:", error);
      return;
    }

    setIsSaved(!!data);
  }, [authSupabase, propertyId, userId]);

  useEffect(() => {
    // Applying the query result to saved state is the purpose of this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void checkIfSaved();
  }, [checkIfSaved]);

  const toggleSave = async () => {
    if (!userId || !propertyId || saveLoading) return;
    setSaveLoading(true);
    try {
      if (isSaved) {
        const { error } = await authSupabase
          .from("saved_properties")
          .delete()
          .eq("user_clerk_id", userId)
          .eq("property_id", propertyId);
        if (error) {
          console.error("Error removing saved property:", error);
          return;
        }

        setIsSaved(false);
        onUnsave?.();
      } else {
        const { error } = await authSupabase
          .from("saved_properties")
          .insert({ user_clerk_id: userId, property_id: propertyId });
        if (error) {
          console.error("Error saving property:", error);
          return;
        }

        setIsSaved(true);
      }
    } finally {
      setSaveLoading(false);
    }
  };

  return { isSaved, saveLoading, toggleSave };
}
