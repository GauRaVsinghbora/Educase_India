import { createSchool, getAllSchools } from "../models/schoolModel.js";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
const toRad = (value) => (value * Math.PI) / 180;
const R = 6371; // Radius of Earth in KM

const dLat = toRad(lat2 - lat1);
const dLon = toRad(lon2 - lon1);

const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
return R * c;
};

export const addSchool = async (req, res) => {
    const db = req.app?.locals?.db;

    if (!db) {
    return res.status(500).json({ error: "Database connection unavailable" });
    }

    const { name, address, latitude, longitude } = req.body;


    if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "All fields (name, address, latitude, longitude) are required." });
    }

    if (typeof name !== "string" || typeof address !== "string") {
    return res.status(400).json({ error: "Name and address must be strings." });
    }

    if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: "Latitude and longitude must be valid numbers." });
    }

    try {
    const cleanedData = {
        name: name.trim(),
        address: address.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
    };

    const [existing] = await db.execute("SELECT school_id FROM schools WHERE name = ?", [cleanedData.name]);

    if (existing.length > 0) {
        return res.status(409).json({ error: "School with this name already exists." });
    }

    const [result] = await db.execute(
        "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
        [cleanedData.name, cleanedData.address, cleanedData.latitude, cleanedData.longitude]
    );

    res.status(201).json({ message: "✅ School added successfully", schoolId: result.insertId });
    } catch (err) {
    console.error("Error adding school:", err);
    res.status(500).json({ error: "Failed to add school to database" });
    }
};


export const listSchoolsByProximity = async (req, res) => {
const db = req.app?.locals?.db;

if (!db) {
    return res.status(500).json({ error: "Database connection unavailable" });
}

const { latitude, longitude } = req.body;

if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: "Latitude and longitude are required and must be valid numbers." });
}

try {
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const schools = await getAllSchools(db);

    const schoolsWithDistance = schools.map((school) => ({
    ...school,
    distance: calculateDistance(userLat, userLon, school.latitude, school.longitude),
    }));

    const sortedSchools = schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({ schools: sortedSchools });
} catch (err) {
    console.error("Error fetching schools:", err);
    res.status(500).json({ error: "Failed to retrieve schools" });
}
};


