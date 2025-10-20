const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function convertToUTF8() {
  console.log('🔄 Iniciando conversión a UTF-8mb4...\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'secondbite_db',
    charset: 'utf8mb4',
    multipleStatements: true
  });

  try {
    console.log('✅ Conectado a MySQL\n');

    // Leer el archivo SQL
    const sqlFile = path.join(__dirname, 'database', 'convert_utf8.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('📄 Ejecutando script de conversión...\n');

    // Ejecutar el SQL
    const [results] = await connection.query(sql);

    console.log('✅ Conversión completada exitosamente\n');

    // Verificar las tablas
    console.log('📊 Verificando configuración de tablas:\n');
    const [tables] = await connection.query(`
      SELECT 
        TABLE_NAME,
        TABLE_COLLATION
      FROM 
        information_schema.TABLES
      WHERE 
        TABLE_SCHEMA = ?
    `, [process.env.DB_NAME || 'secondbite_db']);

    console.table(tables);

    console.log('\n🎉 ¡Base de datos convertida a UTF-8mb4 correctamente!\n');

  } catch (error) {
    console.error('❌ Error al convertir la base de datos:', error.message);
    console.error(error);
  } finally {
    await connection.end();
  }
}

// Ejecutar
convertToUTF8().catch(console.error);
