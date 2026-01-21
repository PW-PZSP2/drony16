import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import backendClient from "@/utils/backend_client";

export function ContentTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [contentData, setContentData] = useState<any>({
    hero: {
      title: "",
      subtitle: "",
      cta_primary: { text: "", link: "" },
      cta_secondary: { text: "", link: "" },
    },
    services: {
      title: "",
      subtitle: "",
    },
    how_it_works: {
      title: "",
      subtitle: "",
    },
    cta_section: {
      title: "",
      subtitle: "",
      cta_primary: { text: "", link: "" },
      cta_secondary: { text: "", link: "" },
    },
    footer: {
      logo: { description: "" },
      contact: { email: "", phone: "", address: "" },
      copyright: "",
    },
  });

  useEffect(() => {
    const fetchHomepageContent = async () => {
      try {
        setLoading(true);
        const response = await backendClient.get("/admins/homepage");
        const data = response?.data || response || {};

        if (data.content && Object.keys(data.content).length > 0) {
          setContentData(data.content);
        }
        if (data.updated_at) {
          setLastUpdated(data.updated_at);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania treści strony głównej:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageContent();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await backendClient.put("/admins/homepage", contentData);
      const data = response?.data || response || {};

      if (data.updated_at) {
        setLastUpdated(data.updated_at);
      }
      setIsEditing(false);
      alert("Treści zostały pomyślnie zaktualizowane!");
      window.location.reload();
    } catch (error) {
      console.error("Błąd podczas zapisywania treści:", error);
      alert("Wystąpił błąd podczas zapisywania treści. Spróbuj ponownie.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Edycja treści strony głównej
            </h3>
            {lastUpdated && (
              <p className="text-sm text-gray-500 mt-1">
                Ostatnia aktualizacja:{" "}
                {new Date(lastUpdated).toLocaleString("pl-PL")}
              </p>
            )}
          </div>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edytuj
            </Button>
          ) : (
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Anuluj
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    Zapisywanie...
                  </>
                ) : (
                  <>
                    <i className="ri-save-line"></i>
                    Zapisz
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-700 mb-4">
              Sekcja główna (Hero)
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Tytuł główny
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={contentData.hero?.title || ""}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        hero: { ...contentData.hero, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">{contentData.hero?.title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Podtytuł
                </label>
                {isEditing ? (
                  <textarea
                    value={contentData.hero?.subtitle || ""}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        hero: { ...contentData.hero, subtitle: e.target.value },
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">{contentData.hero?.subtitle}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-700 mb-4">
              Sekcja usług
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Tytuł sekcji
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={contentData.services?.title || ""}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        services: {
                          ...contentData.services,
                          title: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">{contentData.services?.title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Opis sekcji
                </label>
                {isEditing ? (
                  <textarea
                    value={contentData.services?.subtitle || ""}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        services: {
                          ...contentData.services,
                          subtitle: e.target.value,
                        },
                      })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">
                    {contentData.services?.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-700 mb-4">
              Sekcja "Jak to działa"
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Tytuł sekcji
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={contentData.how_it_works?.title || ""}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        how_it_works: {
                          ...contentData.how_it_works,
                          title: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">
                    {contentData.how_it_works?.title}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Opis sekcji
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={contentData.how_it_works?.subtitle || ""}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        how_it_works: {
                          ...contentData.how_it_works,
                          subtitle: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">
                    {contentData.how_it_works?.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-700 mb-4">
              Sekcja CTA
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Tytuł
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={contentData.cta_section?.title || ""}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        cta_section: {
                          ...contentData.cta_section,
                          title: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">
                    {contentData.cta_section?.title}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Podtytuł
                </label>
                {isEditing ? (
                  <textarea
                    value={contentData.cta_section?.subtitle || ""}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        cta_section: {
                          ...contentData.cta_section,
                          subtitle: e.target.value,
                        },
                      })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">
                    {contentData.cta_section?.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-700 mb-4">
              Dane kontaktowe
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={contentData.footer?.contact?.email || ""}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        footer: {
                          ...contentData.footer,
                          contact: {
                            ...contentData.footer?.contact,
                            email: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">
                    {contentData.footer?.contact?.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Telefon
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={contentData.footer?.contact?.phone || ""}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        footer: {
                          ...contentData.footer,
                          contact: {
                            ...contentData.footer?.contact,
                            phone: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">
                    {contentData.footer?.contact?.phone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Adres
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={contentData.footer?.contact?.address || ""}
                    onChange={(e) =>
                      setContentData({
                        ...contentData,
                        footer: {
                          ...contentData.footer,
                          contact: {
                            ...contentData.footer?.contact,
                            address: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800">
                    {contentData.footer?.contact?.address}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
