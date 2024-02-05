import React, {createContext, PropsWithChildren, useContext, useState} from "react";
import {SessionType} from "../types/SessionType";

export type SessionContextType = {
    sessions: SessionType[],
    addSession: (session: SessionType) => void,
    removeSession: (id: string) => void,
    getSessionById: (id: string) => SessionType | undefined
}

const SessionContext= createContext<SessionContextType | null>(null)

const SessionContextProvider = ({ children }: PropsWithChildren<{}>) => {
    const [sessions, setSessions] = useState<SessionType[]>([])

    const addSession = (session: SessionType) => {
        setSessions([...sessions, session])
    }

    const removeSession = (id: string) => {
        setSessions((prev) => {
            return prev.filter(e => e._id !== id)
        })
    }

    const getSessionById = (id: string) => {
        return sessions.find(e => e._id === id)
    }

    return (
        <SessionContext.Provider value={{sessions, addSession, removeSession, getSessionById}}>
            {children}
        </SessionContext.Provider>
    )
}

export default SessionContextProvider

export const useSessionContext = () => {
    const context = useContext(SessionContext)

    if (!context) {
        throw new Error("useSessionContext must be used inside the SessionContextProvider")
    }

    return context
}