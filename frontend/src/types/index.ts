
export type User = {
    name: string,
    dni: string,
    email: string
    password: string
};

export type RegisterForm = Pick< User, "name" | "dni" | "email" > &{
    password: string,
    password_confirmation: string

}

export type LoginForm = Pick<User, 'email'> & {
    password: string
}