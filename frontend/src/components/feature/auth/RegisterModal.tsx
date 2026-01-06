import { useState } from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

interface RegisterModalProps {
  show: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({
  show,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  const [step, setStep] = useState<"role" | "form">("role");
  const [selectedRole, setSelectedRole] = useState<"client" | "operator">(
    "client",
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    operatingRadius: "",
    services: [] as string[],
    description: "",
  });
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const services = [
    "Ortofotomapa",
    "Numeryczne modele terenu",
    "Chmura punktów",
    "Modele 3D",
    "Scanning laserowy",
  ];

  const handleRoleSelect = (role: "client" | "operator") => {
    setSelectedRole(role);
    setStep("form");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleServiceToggle = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services.includes(service)
        ? formData.services.filter((s) => s !== service)
        : [...formData.services, service],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Symulacja rejestracji
    setTimeout(() => {
      const userData = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: selectedRole,
      };

      // Zapisz dane użytkownika
      localStorage.setItem("user", JSON.stringify(userData));

      setLoading(false);
      onClose();

      // Przekieruj do odpowiedniego panelu
      setTimeout(() => {
        switch (selectedRole) {
          case "operator":
            window.location.href = "/operator-dashboard";
            break;
          case "client":
            window.location.href = "/client-dashboard";
            break;
          default:
            window.location.href = "/";
        }
      }, 100);
    }, 1500);
  };

  const handleBack = () => {
    if (step === "form") {
      setStep("role");
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            {step === "form" && (
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center"
              >
                <i className="ri-arrow-left-line"></i>
              </button>
            )}
            <h2 className="text-xl font-semibold text-gray-800">
              {step === "role" ? "Wybierz typ konta" : "Rejestracja"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        {step === "role" && (
          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelect("client")}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-user-line text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Zleceniodawca</h3>
                  <p className="text-sm text-gray-600">
                    Zlecam prace z wykorzystaniem dronów
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("operator")}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-flight-takeoff-line text-green-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Operator</h3>
                  <p className="text-sm text-gray-600">
                    Wykonuję usługi z wykorzystaniem dronów
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />

            {selectedRole === "operator" && (
              <>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  type="number"
                  name="operatingRadius"
                  value={formData.operatingRadius}
                  onChange={handleInputChange}
                  placeholder="np. 100"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Świadczone usługi
                  </label>
                  <div className="space-y-2">
                    {services.map((service) => (
                      <label
                        key={service}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={() => handleServiceToggle(service)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opis (opcjonalnie)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Krótki opis Twojej działalności..."
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Utwórz konto
            </Button>
          </form>
        )}

        <div className="mt-4 text-center">
          <span className="text-gray-600">Masz już konto? </span>
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-7

            font-medium"
          >
            Zaloguj się
          </button>
        </div>
      </div>
    </div>
  );
}
