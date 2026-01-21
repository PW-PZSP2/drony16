import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Map, Mountain, Cuboid, ScanLine, Camera, Box } from "lucide-react";
import { useState, useEffect } from "react";
import backendClient from "@/utils/backend_client";

export default function Home() {
  const navigate = useNavigate();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await backendClient.get("/admins/homepage");
        const data = response?.data || response || {};
        if (data.content) {
          setContent(data.content);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania treści:", error);
      }
    };
    fetchContent();
  }, []);

  const getIconComponent = (iconName: string) => {
    const icons: any = {
      map: Map,
      mountain: Mountain,
      box: Box,
      cuboid: Cuboid,
      "scan-line": ScanLine,
      camera: Camera,
    };
    return icons[iconName] || Box;
  };

  const getColorClass = (color: string, type: "bg" | "text") => {
    const colors: any = {
      blue: type === "bg" ? "bg-blue-100" : "text-blue-600",
      green: type === "bg" ? "bg-green-100" : "text-green-600",
      gray: type === "bg" ? "bg-gray-100" : "text-gray-600",
    };
    return colors[color] || (type === "bg" ? "bg-gray-100" : "text-gray-600");
  };

  const handleFindOperator = () => {
    navigate("/login?action=register&role=client");
  };

  const handleBecomeOperator = () => {
    navigate("/login?action=register&role=operator");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('../public/images/home_page1.jpg')`,
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="w-full">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                {content?.hero?.title ||
                  "Połącz się z profesjonalnymi operatorami dronów"}
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                {content?.hero?.subtitle ||
                  "Platforma łącząca zleceniodawców potrzebujących usług dronowych z doświadczonymi operatorami. Ortofotomapy, modele 3D, filmy i wiele więcej."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleFindOperator}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  {content?.hero?.cta_primary?.text || "Znajdź Operatora"}
                </Button>
                <Button
                  onClick={handleBecomeOperator}
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-6 text-lg rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  {content?.hero?.cta_secondary?.text || "Zostań Operatorem"}
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="../public/images/home_page2.jpg"
                alt="Profesjonalne drony"
                className="w-full h-96 object-cover object-top rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {content?.services?.title || "Dostępne Usługi"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {content?.services?.subtitle ||
                "Szeroka gama profesjonalnych usług dronowych wykonywanych przez certyfikowanych operatorów"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(content?.services?.items || []).map(
              (service: any, index: number) => {
                const IconComponent = getIconComponent(service.icon);
                return (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div
                      className={`w-12 h-12 ${getColorClass(service.color, "bg")} rounded-lg flex items-center justify-center mb-4`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${getColorClass(service.color, "text")}`}
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {content?.how_it_works?.title || "Jak to działa?"}
            </h2>
            <p className="text-lg text-gray-600">
              {content?.how_it_works?.subtitle ||
                "Prosty proces od zlecenia do realizacji"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(content?.how_it_works?.steps || []).map(
              (step: any, index: number) => (
                <div key={index} className="text-center">
                  <div
                    className={`w-16 h-16 ${getColorClass(step.color, "bg")} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <span
                      className={`text-2xl font-bold ${getColorClass(step.color, "text")}`}
                    >
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            {content?.cta_section?.title || "Gotowy na start?"}
          </h2>
          <p className="text-xl mb-8 text-green-100">
            {content?.cta_section?.subtitle ||
              "Dołącz do naszej platformy już dziś i skorzystaj z profesjonalnych usług dronowych"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleFindOperator}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              {content?.cta_section?.cta_primary?.text || "Utwórz Zlecenie"}
            </Button>
            <Button
              onClick={handleBecomeOperator}
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              {content?.cta_section?.cta_secondary?.text || "Zostań Operatorem"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
