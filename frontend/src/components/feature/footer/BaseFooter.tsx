import type { JSX } from "react";
import { useState, useEffect } from "react";
import backendClient from "@/utils/backend_client";

export default function Footer(): JSX.Element {
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
        console.error("Error during fetching footer content:", error);
      }
    };
    fetchContent();
  }, []);

  return (
    <footer id="kontakt" className="bg-gray-800 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex items-start overflow-hidden justify-center pt-6">
            <img
              src="../public/images/logo.png"
              alt="Logo"
              className="h-60 -mt-16 -mb-20"
            />
          </div>
          <div className="flex items-start justify-center pt-10">
            <p className="text-gray-300 text-left max-w-xs">
              {content?.footer?.logo?.description || "Platforma łącząca zleceniodawców z profesjonalnymi operatorami dronów"}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-gray-300">
              <li>{content?.footer?.contact?.email || "kontakt@droneplatform.pl"}</li>
              <li>{content?.footer?.contact?.phone || "+48 600 123 456"}</li>
              <li>{content?.footer?.contact?.address || "Warszawa, Polska"}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>{content?.footer?.copyright || "© 2026 Droneo. Wszystkie prawa zastrzeżone."}</p>
        </div>
      </div>
    </footer>
  );
}
