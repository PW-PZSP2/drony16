import { useState } from "react";
import Button from "../../base/Button/Button";
import Input from "../../base/Input/Input";

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  onLogin: (userData: any) => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({
  show,
  onClose,
  onLogin,
  onSwitchToRegister,
}: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Symulacja logowania - w rzeczywistej aplikacji tutaj byłoby API
    setTimeout(() => {
      // Symulacja różnych typów użytkowników
      let userData;
      if (formData.email.includes("admin")) {
        userData = {
          id: "1",
          name: "Admin",
          email: formData.email,
          role: "admin",
        };
      } else if (formData.email.includes("operator")) {
        userData = {
          id: "2",
          name: "Jan Kowalski",
          email: formData.email,
          role: "operator",
        };
      } else {
        userData = {
          id: "3",
          name: "Anna Nowak",
          email: formData.email,
          role: "client",
        };
      }

      // Zapisz dane użytkownika
      localStorage.setItem("user", JSON.stringify(userData));

      setLoading(false);
      onLogin(userData);

      // Przekieruj do odpowiedniego panelu
      setTimeout(() => {
        switch (userData.role) {
          case "admin":
            window.location.href = "/admin-dashboard";
            break;
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Logowanie</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            icon="ri-mail-line"
            placeholder="Wpisz swój email"
            required
          />

          <Input
            label="Hasło"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            icon="ri-lock-line"
            placeholder="Wpisz swoje hasło"
            required
          />

          <Button type="submit" className="w-full" loading={loading}>
            Zaloguj się
          </Button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-gray-600">Nie masz konta? </span>
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Zarejestruj się
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 font-medium mb-2">
            Demo - użyj tych emaili:
          </p>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• admin@test.pl - Panel Admina</li>
            <li>• operator@test.pl - Panel Operatora</li>
            <li>• client@test.pl - Panel Zleceniodawcy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
