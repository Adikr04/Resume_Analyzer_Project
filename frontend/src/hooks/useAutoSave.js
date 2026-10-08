import { useEffect, useRef, useCallback } from "react";
import axios from "axios";

/**
 * Auto-saves resume data to the backend with debouncing.
 * @param {string} resumeId - The resume ID to update (null for new resumes)
 * @param {object} data - The resume data to save
 * @param {number} delay - Debounce delay in ms (default: 2000)
 */
export function useAutoSave(resumeId, data, delay = 2000) {
  const timerRef = useRef(null);
  const isMounted = useRef(true);
  const statusRef = useRef("idle"); // idle | saving | saved | error

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const save = useCallback(async (currentData) => {
    if (!resumeId) return;
    statusRef.current = "saving";

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/resume/${resumeId}`,
        currentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (isMounted.current) statusRef.current = "saved";
    } catch (err) {
      if (isMounted.current) statusRef.current = "error";
      console.error("Auto-save failed:", err);
    }
  }, [resumeId]);

  useEffect(() => {
    if (!resumeId || !data) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      save(data);
    }, delay);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [data, resumeId, delay, save]);

  return { status: statusRef.current };
}
