// Mapbox configuration
export const MAPBOX_CONFIG = {
  // Public access token for Mapbox (you should get your own free token from mapbox.com)
  accessToken: "pk.eyJ1IjoicHJhbmF2LW5hbGF3YWRlIiwiYSI6ImNseDQwbzF6NzBqa2gya3F5cGtqdHlyd3YifQ.0E5i3aX8J5G0r7dYF-TxEA",
  
  // Map styles
  styles: {
    street: "mapbox://styles/mapbox/streets-v11",
    satellite: "mapbox://styles/mapbox/satellite-v9",
    dark: "mapbox://styles/mapbox/dark-v10",
  },
  
  // Default settings
  default: {
    latitude: 18.5204, // Pune
    longitude: 73.8567,
    zoom: 12,
  },
  
  // Heatmap settings
  heatmap: {
    minRadius: 200,
    maxRadius: 1000,
    minOpacity: 0.3,
    maxOpacity: 0.8,
  }
};