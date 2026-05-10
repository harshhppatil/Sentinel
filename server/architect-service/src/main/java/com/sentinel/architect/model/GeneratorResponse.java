package com.sentinel.architect.model;

public class GeneratorResponse {

    private String   language;
    private String   database;
    private Integer  port;
    private String   dockerfile;
    private String   dockerCompose;
    private String[] tips;

    // ── Constructor ──────────────────────────────────────────────
    public GeneratorResponse() {}

    public GeneratorResponse(String language, String database, Integer port,
                             String dockerfile, String dockerCompose, String[] tips) {
        this.language      = language;
        this.database      = database;
        this.port          = port;
        this.dockerfile    = dockerfile;
        this.dockerCompose = dockerCompose;
        this.tips          = tips;
    }

    // ── Builder ──────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String   language;
        private String   database;
        private Integer  port;
        private String   dockerfile;
        private String   dockerCompose;
        private String[] tips;

        public Builder language(String language)           { this.language = language;           return this; }
        public Builder database(String database)           { this.database = database;           return this; }
        public Builder port(Integer port)                  { this.port = port;                   return this; }
        public Builder dockerfile(String dockerfile)       { this.dockerfile = dockerfile;       return this; }
        public Builder dockerCompose(String dockerCompose) { this.dockerCompose = dockerCompose; return this; }
        public Builder tips(String[] tips)                 { this.tips = tips;                   return this; }

        public GeneratorResponse build() {
            return new GeneratorResponse(language, database, port, dockerfile, dockerCompose, tips);
        }
    }

    // ── Getters ──────────────────────────────────────────────────
    public String   getLanguage()      { return language; }
    public String   getDatabase()      { return database; }
    public Integer  getPort()          { return port; }
    public String   getDockerfile()    { return dockerfile; }
    public String   getDockerCompose() { return dockerCompose; }
    public String[] getTips()          { return tips; }

    // ── Setters ──────────────────────────────────────────────────
    public void setLanguage(String language)           { this.language = language; }
    public void setDatabase(String database)           { this.database = database; }
    public void setPort(Integer port)                  { this.port = port; }
    public void setDockerfile(String dockerfile)       { this.dockerfile = dockerfile; }
    public void setDockerCompose(String dockerCompose) { this.dockerCompose = dockerCompose; }
    public void setTips(String[] tips)                 { this.tips = tips; }
}