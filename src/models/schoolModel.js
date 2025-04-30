export const createSchool = async (db, schoolData) => {
    const connection = await db.getConnection(); // ✅ get a connection from pool
    try {
        const { name, address, latitude, longitude } = schoolData;
        const [result] = await connection.execute(
            `INSERT INTO schools (name, address, latitude, longitude)
                VALUES (?, ?, ?, ?)`,
            [name.toLowerCase(), address.toLowerCase(), latitude, longitude]
        );

        return result.insertId;
    } finally {
        connection.release(); 
    }
};
export const getAllSchools = async (db) => {
    const [rows] = await db.query(`SELECT * FROM schools`);
    return rows;
};