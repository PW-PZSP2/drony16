from geopy.geocoders import Nominatim  # type: ignore
from geopy.exc import GeocoderTimedOut, GeocoderServiceError  # type: ignore
import math
from typing import Optional, Tuple

geolocator = Nominatim(user_agent="drony16_app")


def get_coordinates(address: str) -> Optional[Tuple[float, float]]:
    try:
        location = geolocator.geocode(address, timeout=10)
        if location:
            return location.latitude, location.longitude
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        print(f"Geocoding service error: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error during geocoding: {e}")
        return None
    return None


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371  # Earth radius in kilometers

    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c
