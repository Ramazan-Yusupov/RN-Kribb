import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";

export default function App() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) return <Redirect href="/(root)/(tabs)" />;

  return <Redirect href="/sign-up" />;
}
