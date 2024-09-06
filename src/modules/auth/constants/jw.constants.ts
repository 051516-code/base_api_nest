export const jwtConstants = {
    secret : process.env.JWT_SECRET || 'helperroads',
    expireIn : '60s',
}