import z from "zod"

export type DateTimeProps = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBack: () => void
    onSubmit: () => void
    loading: boolean
}
export const DateTimeFormSchema = z.object({
    dob: z.date({
        required_error: "A date of birth is required.",
    }),
})


