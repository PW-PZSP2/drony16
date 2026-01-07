import { useState } from "react";

import ServiceParameters from "@/components/feature/client_dashboard/elements/ServiceParameters";
import {create_order} from "@/services/client_service"; 
import type { OrderData } from "@/services/client_service";

import { Button } from "@/components/ui/button";

export default function CreateOrderTab() {
  const [formData, setFormData] = useState({
    title: "",
    service: "",
    description: "",
    location: "",
    deadlineType: "flight", // 'flight' lub 'completion'
    deadline: "",
    parameters: {} as any,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    { id: "ortofoto", name: "Ortofotomapa", icon: "ri-map-2-line" },
    {
      id: "terrain",
      name: "Numeryczne modele terenu",
      icon: "ri-landscape-line",
    },
    { id: "pointcloud", name: "Chmura punktów", icon: "ri-bubble-chart-line" },
    { id: "3d", name: "Modele 3D", icon: "ri-3d-view-line" },
    { id: "laser", name: "Scanning laserowy", icon: "ri-scanner-line" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    create_order(formData as OrderData).then((response) => {
      setIsSubmitting(false);
      if (response.success) {
        alert(`Zlecen÷e zostało utworzone pomyślnie! ID zlecenia: ${response.orderId}`);
      } else {
        alert(`Błąd podczas tworzenia zlecenia: ${response.message}`);
      }});
  };

  return (
    <>
      {isSubmitting && <div>Wysyłanie...</div>}
      {!isSubmitting && <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tytuł zlecenia
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="np. Ortofotomapa działki budowlanej"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Typ terminu
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deadlineType"
                  value="flight"
                  checked={formData.deadlineType === "flight"}
                  onChange={(e) =>
                    setFormData({ ...formData, deadlineType: e.target.value })
                  }
                  className="mr-2"
                />
                <span className="text-sm">Termin nalotu</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deadlineType"
                  value="completion"
                  checked={formData.deadlineType === "completion"}
                  onChange={(e) =>
                    setFormData({ ...formData, deadlineType: e.target.value })
                  }
                  className="mr-2"
                />
                <span className="text-sm">Termin zakończenia</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Rodzaj usługi
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {services.map((service) => (
              <label
                key={service.id}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.service === service.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="service"
                  value={service.id}
                  checked={formData.service === service.id}
                  onChange={(e) =>
                    setFormData({ ...formData, service: e.target.value })
                  }
                  className="sr-only"
                />
                <div className="w-8 h-8 flex items-center justify-center mr-3">
                  <i
                    className={`${service.icon} text-lg ${
                      formData.service === service.id
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  ></i>
                </div>
                <span
                  className={`text-sm font-medium ${
                    formData.service === service.id
                      ? "text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  {service.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lokalizacja
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Wpisz adres lub współrzędne"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i className="ri-map-pin-line"></i>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Kliknij ikonę mapy aby wybrać lokalizację na mapie
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData.deadlineType === "flight"
              ? "Termin nalotu"
              : "Termin zakończenia"}
          </label>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opis zlecenia
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Opisz szczegóły zlecenia, wymagania techniczne, oczekiwania..."
            required
          />
        </div>

        {formData.service && <ServiceParameters service={formData.service} />}

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button">
            Zapisz jako szkic
          </Button>
          <Button type="submit">Opublikuj zlecenie</Button>
        </div>
      </form>}
    </>
  );
}
