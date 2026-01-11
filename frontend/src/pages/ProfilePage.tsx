import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Save, Loader2 } from "lucide-react";
import { AuthService } from "../services/authorization_service";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          setProfile({
            name: user.user_name || "",
            email: user.email || "",
            phone: user.phone_number || "",
            description: "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Connect to backend update endpoint when available
    console.log("Saving profile:", profile);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow bg-gray-50 p-4 md:p-8 h-full min-h-[calc(100vh-64px)] justify-center">
      <Card className="w-full flex-1 flex flex-col shadow-sm rounded-3xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Mój Profil</CardTitle>
              <CardDescription>
                Zarządzaj swoimi danymi i ustawieniami konta
              </CardDescription>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="rounded-full"
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Zapisz
                </>
              ) : (
                <>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edytuj
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nazwa użytkownika</Label>
            <Input
              id="name"
              value={profile.name}
              disabled={true}
              className="bg-gray-100 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled={true}
                className="bg-gray-100 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={profile.phone}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2 flex-1 flex flex-col">
            <Label htmlFor="description">O mnie</Label>
            <Textarea
              id="description"
              value={profile.description}
              disabled={!isEditing}
              onChange={(e) =>
                setProfile({ ...profile, description: e.target.value })
              }
              className="flex-1 min-h-[100px] rounded-lg resize-none"
              placeholder="Napisz coś o sobie..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
