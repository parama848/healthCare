import axios from "axios";
import EmergencyEvent from "../models/EmergencyEvent.js";

export const activateEmergency = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const io = req.app.get("io");

    if (!lat || !lng) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    // 🔥 1️⃣ Get nearby hospitals using Overpass API
    const overpassQuery = `
      [out:json];
      node
        ["amenity"="hospital"]
        (around:5000, ${lat}, ${lng});
      out;
    `;

    const hospitalRes = await axios.post(
      "https://overpass-api.de/api/interpreter",
      overpassQuery,
      {
        headers: { "Content-Type": "text/plain" }
      }
    );

    if (!hospitalRes.data.elements.length) {
      return res.status(404).json({ message: "No hospitals found" });
    }

    const hospital = hospitalRes.data.elements[0];
    const hospitalLat = hospital.lat;
    const hospitalLng = hospital.lon;

    // 🔥 2️⃣ Get route + ETA from OSRM
    const routeRes = await axios.get(
      `http://router.project-osrm.org/route/v1/driving/${lng},${lat};${hospitalLng},${hospitalLat}?overview=false`
    );

    const durationSeconds = routeRes.data.routes[0].duration;
    const etaMinutes = Math.round(durationSeconds / 60);

    // 🔥 3️⃣ Save event
    await EmergencyEvent.create({
      userLocation: { lat, lng },
      hospitalName: hospital.tags.name || "Nearby Hospital",
      eta: `${etaMinutes} min`
    });

    // 🔥 4️⃣ Simulate ambulance movement
    let ambulanceLat = hospitalLat;
    let ambulanceLng = hospitalLng;

    const interval = setInterval(() => {
      ambulanceLat += (lat - ambulanceLat) * 0.05;
      ambulanceLng += (lng - ambulanceLng) * 0.05;

      io.emit("ambulance:update", {
        lat: ambulanceLat,
        lng: ambulanceLng
      });

      const distance =
        Math.abs(ambulanceLat - lat) +
        Math.abs(ambulanceLng - lng);

      if (distance < 0.0001) {
        clearInterval(interval);
        io.emit("ambulance:arrived");
      }
    }, 4000);

    res.json({
      hospital: hospital.tags.name || "Nearby Hospital",
      eta: `${etaMinutes} min`,
      hospitalLocation: { lat: hospitalLat, lng: hospitalLng }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Emergency failed" });
  }
};
