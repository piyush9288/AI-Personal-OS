package com.piyush.aios.ai_os.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrationRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseMigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("Starting Database Migration: Altering columns to TEXT...");
            
            // Alter chat message column
            jdbcTemplate.execute("ALTER TABLE chat ALTER COLUMN message TYPE text");
            
            // Alter goal description column
            jdbcTemplate.execute("ALTER TABLE goal ALTER COLUMN description TYPE text");
            
            // Alter task description column
            jdbcTemplate.execute("ALTER TABLE task ALTER COLUMN description TYPE text");
            
            System.out.println("Database Migration completed successfully!");
        } catch (Exception e) {
            System.err.println("Database Migration Failed or Already Applied: " + e.getMessage());
        }
    }
}
