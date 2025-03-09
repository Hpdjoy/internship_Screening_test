import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";

const Map = () => {
  const [evData, setEvData] = useState({});
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch and parse CSV data
        const csvResponse = await fetch("Data.csv");
        if (!csvResponse.ok) throw new Error(`CSV fetch failed: ${csvResponse.status}`);
        const csvText = await csvResponse.text();

        await new Promise((resolve, reject) => {
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            transformHeader: (header) => header.trim(),
            transform: (value) => (typeof value === "string" ? value.trim() : value),
            complete: (result) => {
              try {
                const data = result.data;
                if (!data?.length) throw new Error("No data parsed from CSV");

                const countyCounts = {};
                data.forEach((row) => {
                  if (!row.County) return;

                  let county = row.County.trim().toLowerCase();

                  // Ensure county name matches GeoJSON naming convention
                  if (!county.endsWith(" county")) county += " county";

                  countyCounts[county] = (countyCounts[county] || 0) + 1;
                });

                setEvData(countyCounts);
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            error: (err) => reject(new Error(`Papa Parse error: ${err.message}`)),
          });
        });

        // Fetch GeoJSON
        const geoResponse = await fetch("/counties.geojson");
        if (!geoResponse.ok) throw new Error(`GeoJSON fetch failed: ${geoResponse.status}`);
        const geoData = await geoResponse.json();
        setGeoJsonData(geoData);

      } catch (err) {
        setError(err.message);
        console.error("Error details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Define color scale for EV counts
  const getColor = (count) => {
    return count > 500 ? "#084594"
         : count > 300 ? "#2171b5"
         : count > 100 ? "#6baed6"
         : count > 50 ? "#bdd7e7"
         : "#eff3ff";
  };

  // Style function for GeoJSON features
  const styleFeature = (feature) => {
    const countyName = feature.properties?.JURISDICT_NM?.trim().toLowerCase();
    const count = countyName ? evData[countyName] || 0 : 0;

    return {
      fillColor: getColor(count),
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  };

  // Add a legend to the map
  const Legend = () => {
    const grades = [0, 100, 200, 300, 500];

    return (
      <div style={{
        position: "absolute",
        bottom: "30px",
        left: "10px",
        padding: "10px",
        background: "white",
        boxShadow: "0 0 15px rgba(0,0,0,0.2)",
        borderRadius: "5px",
        zIndex: 1000,
        fontSize: "14px",
      }}>
        <h4 style={{ margin: 0, textAlign: "center" }}>EV Count per County</h4>
        <ul style={{ listStyleType: "none", padding: 0, margin: "5px 0" }}>
          {grades.map((grade, i) => (
            <li key={grade} style={{ display: "flex", alignItems: "center", margin: "4px 0" }}>
              <span style={{
                background: getColor(grade + 1),
                width: "18px",
                height: "18px",
                display: "inline-block",
                marginRight: "8px",
                border: "1px solid #ccc",
              }} />
              {grade}{grades[i + 1] ? `–${grades[i + 1]}` : "+"}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading map data...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <MapContainer
        center={[47.5, -120]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => setTimeout(() => map.invalidateSize(), 0)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={styleFeature}
            onEachFeature={(feature, layer) => {
              const countyName = feature.properties?.JURISDICT_NM?.trim().toLowerCase();
              const count = countyName ? evData[countyName] || 0 : 0;

              // Debugging logs
              console.log("GeoJSON County:", feature.properties?.JURISDICT_NM);
              console.log("EV Data:", evData);
              console.log("Matched County:", countyName, "Count:", count);

              layer.bindPopup(`${feature.properties?.JURISDICT_NM || "Unknown"}: ${count} EVs`);
            }}
          />
        )}
      </MapContainer>
      {geoJsonData && <Legend />}
    </div>
  );
};

export default Map;
