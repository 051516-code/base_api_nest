declare module 'process' {
    interface ProcessEnv {
        PORT: string;
        DATABASE_HOST: string;
        DATABASE_PORT: string;
        DATABASE_USER: string;
        DATABASE_PASSWORD: string;
        DATABASE_NAME: string;
        JWT_SECRET: string;
    }
}
