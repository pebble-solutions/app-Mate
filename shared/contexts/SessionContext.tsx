import React, {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import { SessionType } from "../types/SessionType";
import { Session } from "../classes/Session";
import {useRequestsContext} from "./RequestsContext";
import {deleteRequest, getRequest, patchRequest, postRequest} from "@pebble-solutions/api-request";
import {ReadParamsType} from "@pebble-solutions/api-request/lib/types/types";

export type SessionContextType = {
    sessions: SessionType[],
    addSession: (session: Session) => void,
    removeSession: (id: string) => void,
    getSessionById: (id: string) => SessionType | undefined,
    updateSession: (session: Session) => void
    fetchSessionsFromAPI: (params?: ReadParamsType) => Promise<void>
    getSessionsFromActivity: (activityId: string) => SessionType[]
    pending: boolean
    loading: boolean
}

const SessionContext = createContext<SessionContextType | null>(null)

const SessionContextProvider = ({ children }: PropsWithChildren<{}>) => {
    const [sessions, setSessions] = useState<SessionType[]>([])
    const {requestsController, pushRequest} = useRequestsContext()
    const [pending, setPending] = useState(false)
    const [loading, setLoading] = useState(false)

    const updateSessionsState = (sessions: SessionType[]) => {
        setSessions((prev) => {
            let sessionsList = [...prev]

            sessions.forEach(session => {
                const prevIndex = sessionsList.findIndex(e => e._id === session._id)
                if (prevIndex !== -1) {
                    sessionsList.splice(prevIndex, 1, new Session(session))
                } else {
                    sessionsList.push(new Session(session))
                }
            })

            return sessionsList
        })
    }

    const removeFromSessionsState = (sessionsId: string[]) => {
        setSessions((prev) => prev.filter(e => !sessionsId.includes(e._id)))
    }

    const addSession = (session: Session) => {
        pushRequest(postRequest("https://api.pebble.solutions/v5/metric/", session.json()))
        updateSessionsState([session])
    }

    const removeSession = (id: string) => {
        pushRequest(deleteRequest("https://api.pebble.solutions/v5/metric/"+id))
        removeFromSessionsState([id])
    }

    const updateSession = (session: Session) => {
        pushRequest(patchRequest("https://api.pebble.solutions/v5/metric/"+session._id, session.json()))
        updateSessionsState([session])
    }

    const fetchSessionsFromAPI = async (params?: ReadParamsType) => {
        const request = requestsController.addRequest(
            getRequest("https://api.pebble.solutions/v5/metric/", params)
        )
        setPending(true)
        try {
            await request.send()
            const data: SessionType[] = await request.content()
            updateSessionsState(data)
        } catch (e)  {
            throw e
        } finally {
            setPending(false)
        }

    }

    const getSessionById = (id: string) => {
        return sessions.find(e => e._id === id)
    }

    const getSessionsFromActivity = (activityId: string) => {
        return sessions.filter(e => e.type_id === activityId && e.type === "activity")
    }

    // Load active sessions for the current user
    useEffect(() => {
        setLoading(true)
        fetchSessionsFromAPI({
            is_active: true
        }).finally(() => setLoading(false))
    }, []);

    return (
        <SessionContext.Provider value={{
            sessions,
            addSession,
            removeSession,
            getSessionById,
            updateSession,
            fetchSessionsFromAPI,
            getSessionsFromActivity,
            pending,
            loading
        }}>
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