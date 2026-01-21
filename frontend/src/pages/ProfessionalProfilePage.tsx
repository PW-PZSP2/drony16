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
import {
  Loader2,
  Star,
  MapPin,
  Plus,
  Trash2,
  FileText,
  Globe,
} from "lucide-react";
import { AuthService } from "../services/authorization_service";
import { OperatorService } from "../services/operator_service";
import type { Service, Attachment } from "../services/operator_service";
import MapPreview from "@/components/base/MapPreview/MapPreview";

import { useNavigate } from "react-router-dom";

export default function ProfessionalProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Stats
  const [averageScore, setAverageScore] = useState<number | null>(null);

  // Location
  const [location, setLocation] = useState("");
  const [area, setArea] = useState(0);

  const [savingLocation, setSavingLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Services
  const [myServices, setMyServices] = useState<Service[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newAttachment, setNewAttachment] = useState({
    name: "",
    description: "",
    file_url: "",
  });
  const [isAddingAttachment, setIsAddingAttachment] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (!currentUser) return;

        setLocation(currentUser.localisation || "");
        setArea(currentUser.area || 0);

        const [avgData, myServicesData, allServicesData, attachmentsData] =
          await Promise.all([
            OperatorService.getOperatorAverage(currentUser.user_id).catch(
              () => ({ average_score: null }),
            ),
            OperatorService.getMyServices(),
            OperatorService.getAllServices(),
            OperatorService.getMyAttachments(),
          ]);

        setAverageScore(avgData.average_score);
        setMyServices(myServicesData.services);
        setAllServices(allServicesData);
        setAttachments(attachmentsData.attachments);
      } catch (error) {
        console.error("Failed to load profile data", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  const handleSaveLocation = async () => {
    setSavingLocation(true);
    try {
      await OperatorService.updateLocation(location);
      await OperatorService.updateArea(Number(area));
    } catch (error) {
      console.error("Failed to save location", error);
    } finally {
      setSavingLocation(false);
    }
  };

  const handleAddService = async () => {
    if (!selectedServiceId) return;
    const serviceId = Number(selectedServiceId);
    if (myServices.some((s) => s.service_id === serviceId)) return;

    const newServiceList = [...myServices.map((s) => s.service_id), serviceId];
    try {
      await OperatorService.updateMyServices(newServiceList);
      // Refresh local state
      const addedService = allServices.find((s) => s.service_id === serviceId);
      if (addedService) {
        setMyServices([...myServices, addedService]);
      }
      setSelectedServiceId("");
    } catch (error) {
      console.error("Failed to add service", error);
    }
  };

  const handleRemoveService = async (id: number) => {
    const newServiceList = myServices
      .filter((s) => s.service_id !== id)
      .map((s) => s.service_id);
    try {
      await OperatorService.updateMyServices(newServiceList);
      setMyServices(myServices.filter((s) => s.service_id !== id));
    } catch (error) {
      console.error("Failed to remove service", error);
    }
  };

  const handleAddAttachment = async () => {
    if (!newAttachment.name || !newAttachment.file_url) return;
    try {
      const added = await OperatorService.addAttachment(
        newAttachment.name,
        newAttachment.description,
        newAttachment.file_url,
      );
      setAttachments([...attachments, added]);
      setNewAttachment({ name: "", description: "", file_url: "" });
      setIsAddingAttachment(false);
    } catch (error) {
      console.error("Failed to add attachment", error);
    }
  };

  const handleRemoveAttachment = async (id: number) => {
    try {
      await OperatorService.removeAttachment(id);
      setAttachments(attachments.filter((a) => a.attachment_id !== id));
    } catch (error) {
      console.error("Failed to remove attachment", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow bg-gray-50 p-4 md:p-8 min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Statistics Card */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              Średnia ocena
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {averageScore !== null ? averageScore.toFixed(1) : "Brak ocen"}
              {averageScore !== null && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  / 5.0
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location & Area */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Lokalizacja i Zasięg
            </CardTitle>
            <CardDescription>
              Ustaw swoją bazę wypadową i zasięg działania
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Lokalizacja (Miasto)</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="np. Warszawa"
                    className="rounded-lg flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowMap(!showMap)}
                    title={showMap ? "Ukryj mapę" : "Pokaż na mapie"}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Zasięg (km)</Label>
                <Input
                  id="area"
                  type="number"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="rounded-lg"
                />
              </div>
            </div>
            {showMap && (
              <div className="mb-4">
                <MapPreview address={location} />
              </div>
            )}
            <div className="flex justify-end">
              <Button
                onClick={handleSaveLocation}
                disabled={savingLocation}
                className="rounded-full"
              >
                {savingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  "Zapisz zmiany"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-500" />
              Moje Usługi
            </CardTitle>
            <CardDescription>
              Zarządzaj usługami, które oferujesz klientom
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {myServices.length > 0 ? (
                myServices.map((service) => (
                  <div
                    key={service.service_id}
                    className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100 text-sm font-medium"
                  >
                    {service.name}
                    <button
                      onClick={() => handleRemoveService(service.service_id)}
                      className="text-emerald-400 hover:text-emerald-900 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  Nie wybrano jeszcze żadnych usług.
                </p>
              )}
            </div>

            <div className="flex items-end gap-3 max-w-md">
              <div className="w-full space-y-2">
                <Label htmlFor="service-select">Dodaj usługę</Label>
                <select
                  id="service-select"
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                >
                  <option value="">Wybierz usługę...</option>
                  {allServices
                    .filter(
                      (s) =>
                        !myServices.some(
                          (ms) => ms.service_id === s.service_id,
                        ),
                    )
                    .map((s) => (
                      <option key={s.service_id} value={s.service_id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>
              <Button
                onClick={handleAddService}
                disabled={!selectedServiceId}
                className="rounded-full"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" /> Dodaj
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                Załączniki i Certyfikaty
              </CardTitle>
              <CardDescription>
                Dodaj linki do swojego portfolio lub certyfikatów
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingAttachment(!isAddingAttachment)}
              className="rounded-full"
            >
              {isAddingAttachment ? (
                "Anuluj"
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> Dodaj nowy
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAddingAttachment && (
              <div className="bg-gray-50 p-4 rounded-xl border space-y-3 mb-4 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="att-name">Nazwa</Label>
                    <Input
                      id="att-name"
                      value={newAttachment.name}
                      onChange={(e) =>
                        setNewAttachment({
                          ...newAttachment,
                          name: e.target.value,
                        })
                      }
                      placeholder="np. Licencja ULC"
                      className="bg-white rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="att-url">Link URL</Label>
                    <Input
                      id="att-url"
                      value={newAttachment.file_url}
                      onChange={(e) =>
                        setNewAttachment({
                          ...newAttachment,
                          file_url: e.target.value,
                        })
                      }
                      placeholder="https://..."
                      className="bg-white rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="att-desc">Opis (opcjonalnie)</Label>
                  <Input
                    id="att-desc"
                    value={newAttachment.description}
                    onChange={(e) =>
                      setNewAttachment({
                        ...newAttachment,
                        description: e.target.value,
                      })
                    }
                    placeholder="Krótki opis..."
                    className="bg-white rounded-lg"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddAttachment}
                    className="rounded-full"
                  >
                    Dodaj załącznik
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {attachments.length > 0 ? (
                attachments.map((att) => (
                  <div
                    key={att.attachment_id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{att.name}</div>
                        {att.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {att.description}
                          </div>
                        )}
                        <a
                          href={att.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline truncate block max-w-[200px] md:max-w-md"
                        >
                          {att.file_path}
                        </a>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAttachment(att.attachment_id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Brak dodanych załączników.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
