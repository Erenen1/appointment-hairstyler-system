'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Step1UserInfo = {
    fullName: string
    email: string
    phone: string
}

type Step2Service = {
    // 2. adımda ne varsa (örnek)
    age: number
}

type Step3Staff = {
    // 3. adımda ne varsa
    address: string
}

type Step4DateTime = {
    // 4. adımda ne varsa
    message: string
}

type FormData = {
    step1UserInfo?: Step1UserInfo
    step2Service?: Step2Service
    step3Staff?: Step3Staff
    step4DateTime?: Step4DateTime
}

type FormContextType = {
    data: FormData
    setFormData: (values: Partial<FormData>) => void
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export const GetAppointmentProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<FormData>({})

    const setFormData = (values: Partial<FormData>) => {
        setData((prev) => ({ ...prev, ...values }))
    }
    return (
        <FormContext.Provider value= {{ data, setFormData }
}>
    { children }
    </FormContext.Provider>
      )


export const useFormContextData = () => {
    const context = useContext(FormContext)
    if (!context) {
        throw new Error('useFormContextData must be used within a FormProvider')
    }
    return context
}
