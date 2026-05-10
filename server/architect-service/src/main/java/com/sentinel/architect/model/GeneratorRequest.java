package com.sentinel.architect.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class GeneratorRequest {

    @NotBlank(message = "Language is required")
    private String language;

    @NotBlank(message = "Database is required")
    private String database;

    @NotNull(message = "Port is required")
    @Min(value = 1024,  message = "Port must be at least 1024")
    @Max(value = 65535, message = "Port must be at most 65535")
    private Integer port;

    private String  packageManager;
    private String  pythonVersion;
    private String  nodeVersion;
    private Boolean includeCompose;

    // ── Getters ──────────────────────────────────────────────────
    public String  getLanguage()       { return language; }
    public String  getDatabase()       { return database; }
    public Integer getPort()           { return port; }
    public String  getPackageManager() { return packageManager; }
    public String  getPythonVersion()  { return pythonVersion; }
    public String  getNodeVersion()    { return nodeVersion; }
    public Boolean getIncludeCompose() { return includeCompose; }

    // ── Setters ──────────────────────────────────────────────────
    public void setLanguage(String language)              { this.language = language; }
    public void setDatabase(String database)              { this.database = database; }
    public void setPort(Integer port)                     { this.port = port; }
    public void setPackageManager(String packageManager)  { this.packageManager = packageManager; }
    public void setPythonVersion(String pythonVersion)    { this.pythonVersion = pythonVersion; }
    public void setNodeVersion(String nodeVersion)        { this.nodeVersion = nodeVersion; }
    public void setIncludeCompose(Boolean includeCompose) { this.includeCompose = includeCompose; }
}