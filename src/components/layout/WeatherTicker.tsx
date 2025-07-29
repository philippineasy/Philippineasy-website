import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloudSun, faCloud, faBolt, faCloudShowersHeavy, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// Liste étendue de villes avec coordonnées pour plus de précision
const cityData = [
  { displayName: 'Manille', lat: 14.5995, lon: 120.9842 },
  { displayName: 'Cebu', lat: 10.3157, lon: 123.8918 },
  { displayName: 'Davao', lat: 7.1907, lon: 125.4553 },
  { displayName: 'Quezon City', lat: 14.6760, lon: 121.0437 },
  { displayName: 'Angeles', lat: 15.1453, lon: 120.5881 },
  { displayName: 'Baguio', lat: 16.4023, lon: 120.5960 },
  { displayName: 'Vigan', lat: 17.5747, lon: 120.3869 },
  { displayName: 'Legazpi (Mayon)', lat: 13.1391, lon: 123.7438 },
  { displayName: 'Banaue (Rizières)', lat: 16.9103, lon: 121.0581 },
  { displayName: 'Puerto Princesa', lat: 9.7386, lon: 118.7328 },
  { displayName: 'El Nido', lat: 11.1796, lon: 119.3925 },
  { displayName: 'Coron', lat: 11.9986, lon: 120.2044 },
  { displayName: 'Boracay', lat: 11.9675, lon: 121.9256 },
  { displayName: 'Bohol', lat: 9.8498, lon: 124.2832 },
  { displayName: 'Dumaguete', lat: 9.3087, lon: 123.3053 },
  { displayName: 'Iloilo', lat: 10.7202, lon: 122.5621 },
  { displayName: 'Siquijor', lat: 9.1859, lon: 123.6322 },
  { displayName: 'Siargao', lat: 9.7875, lon: 126.1586 },
  { displayName: 'Cagayan de Oro', lat: 8.4541, lon: 124.6319 },
  { displayName: 'Zamboanga', lat: 6.9214, lon: 122.0790 },
];

async function getWeatherData() {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    console.error("ERREUR: La clé API météo (WEATHER_API_KEY) n'est pas définie.");
    return [];
  }

  const results = await Promise.allSettled(cityData.map(async (city) => {
    const locationQuery = `${city.lat},${city.lon}`;
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${locationQuery}&aqi=no`);
    
    if (!response.ok) throw new Error(`Erreur API pour "${city.displayName}": ${response.status}`);
    
    const data = await response.json();
    
    // CHANGEMENT 2 : Récupérer l'objet complet (icône + couleur)
    const iconData = getIconAndColorForCondition(data.current.condition.text);

    return {
      city: city.displayName,
      temp: Math.round(data.current.temp_c),
      icon: iconData.icon,
      colorClass: iconData.colorClass, // <-- On stocke la classe de couleur
    };
  }));

  const successfulWeatherData = results
    .filter(result => result.status === 'fulfilled')
    .map(result => (result as PromiseFulfilledResult<WeatherData>).value);
  
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.warn(`Impossible de récupérer la météo pour ${cityData[index].displayName}: ${(result.reason as Error).message}`);
    }
  });

  return successfulWeatherData;
}

// CHANGEMENT 1 : La fonction retourne maintenant un objet avec l'icône ET une classe de couleur
interface WeatherData {
  city: string;
  temp: number;
  icon: IconDefinition;
  colorClass: string;
}

function getIconAndColorForCondition(condition: string): { icon: IconDefinition, colorClass: string } {
  const lowerCaseCondition = condition.toLowerCase();
  
  if (lowerCaseCondition.includes('sunny') || lowerCaseCondition.includes('clear')) {
    return { icon: faSun, colorClass: 'text-accent/80' };
  }
  if (lowerCaseCondition.includes('partly cloudy')) {
    return { icon: faCloudSun, colorClass: 'text-accent/80' }; // Le soleil domine
  }
  if (lowerCaseCondition.includes('cloudy') || lowerCaseCondition.includes('overcast')) {
    return { icon: faCloud, colorClass: 'text-white' }; // Nuage neutre blanc
  }
  if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle') || lowerCaseCondition.includes('shower')) {
    return { icon: faCloudShowersHeavy, colorClass: 'text-cyan-300' }; // Couleur bleutée pour la pluie
  }
  if (lowerCaseCondition.includes('thunder')) {
    return { icon: faBolt, colorClass: 'text-accent/90' }; // Jaune vif pour l'éclair
  }
  // Icône par défaut pour brouillard, neige (peu probable), etc.
  return { icon: faQuestionCircle, colorClass: 'text-gray-400' };
}

export default async function WeatherTicker() {
  const weatherData = await getWeatherData();

  if (!weatherData || weatherData.length === 0) {
    console.warn("Aucune donnée météo n'a pu être récupérée pour le bandeau.");
    return null;
  }
  
  const animationDuration = weatherData.length > 15 ? '60s' : '40s';
  const tickerItems = [...weatherData, ...weatherData];

  return (
    <div className="bg-primary text-primary-foreground shadow-md w-full overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-scroll" style={{ animationDuration }}>
        {tickerItems.map((weather, index) => (
          <span key={index} className="inline-flex items-center mx-4 py-2 text-sm font-semibold">
            {/* CHANGEMENT 3 : La classe de couleur est maintenant dynamique */}
            <FontAwesomeIcon
              icon={weather.icon}
              className={`mr-2 ${weather.colorClass}`}
            />
            {weather.city}: {weather.temp}°C
          </span>
        ))}
      </div>
    </div>
  );
}
