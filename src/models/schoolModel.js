export const createSchool = async (db, schoolData) => {
    const { name, address, latitude, longitude } = schoolData;

    const [result] = await db.execute(
    `INSERT INTO schools (name, address, latitude, longitude)
    VALUES (?, ?, ?, ?)`,
    [name, address, latitude, longitude]
    );

    return result.insertId;
};

export const getAllSchools = async (db) => {
    const [rows] = await db.query(`SELECT * FROM schools`);
    return rows;
};