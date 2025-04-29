import { createSchool, getAllSchools } from "../models/schoolModel.js";

export const createSchoolHandler = async (req, res) => {
try {
    const { name, address, latitude, longitude } = req.body;

    // Validation inside the handler itself
    if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "All fields (name, address, latitude, longitude) are required." });
    }

    if (typeof name !== "string" || typeof address !== "string") {
    return res.status(400).json({ error: "Name and address must be strings." });
    }

    if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: "Latitude and longitude must be valid numbers." });
    }

    // Clean the data: trim and lowercase name and address
    const cleanedData = {
    name: name.trim().toLowerCase(),
    address: address.trim().toLowerCase(),
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude)
    };

    const schoolId = await createSchool(req.app.locals.db, cleanedData);
    
    res.status(201).json({ message: "✅ School created successfully", schoolId });
} catch (err) {
    console.error("Error creating school:", err);
    res.status(500).json({ error: "Something went wrong" });
}
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
};

export const getSchoolsHandler = async (req, res) => {
try {
    const schools = await getAllSchools(req.app.locals.db);
    res.json(schools);
} catch (err) {
    console.error("Error fetching schools:", err);
    res.status(500).json({ error: "Database error" });
}
};

export const listSchoolsByProximity = async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: "Latitude and longitude are required and must be valid numbers." });
    }

    try {
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const schools = await getAllSchools(req.app.locals.db);

    const schoolsWithDistance = schools.map((school) => ({
        ...school,
        distance: calculateDistance(userLat, userLon, school.latitude, school.longitude)
    }));

    const sortedSchools = schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
    } catch (err) {
    console.error("Error fetching schools by proximity:", err);
    res.status(500).json({ error: "Internal server error" });
    }
};
