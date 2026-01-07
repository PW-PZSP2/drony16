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
import { Roles } from "../types/auth/user_role";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    operatingRadius: 0,
    description: "",
  });
  const [isOperator, setIsOperator] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          setIsOperator(user.roles.includes(Roles.OPERATOR));
          setProfile({
            name: user.user_name || "",
            email: user.email || "",
            phone: user.phone_number || "",
            location: user.localisation || "",
            operatingRadius: user.area || 0,
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
    <div className="flex flex-col flex-grow bg-gray-50 p-4 md:p-8 h-full min-h-[calc(100vh-64px)]">
      <Card className="flex-1 w-full">
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
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nazwa użytkownika</Label>
              <Input
                id="name"
                value={profile.name}
                disabled={true}
                className="bg-gray-100"
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
                  className="bg-gray-100"
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
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lokalizacja</Label>
              <Input
                id="location"
                value={profile.location}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
              />
            </div>

            {isOperator && (
              <div className="space-y-2">
                  <Label htmlFor="operatingRadius">Zasięg działania (km)</Label>
                   <Input
                  id="operatingRadius"
                  type="number"
                  value={profile.operatingRadius}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfile({ ...profile, operatingRadius: Number(e.target.value) })
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">O mnie</Label>
              <Textarea
                id="description"
                value={profile.description}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({ ...profile, description: e.target.value })
                }
                className="min-h-[100px]"
                placeholder="Napisz coś o sobie..."
              />
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
